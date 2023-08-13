import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthUserInput } from '../dto/authUser.input';
import { getOneUserByUsername, getUserRepository } from '../../users/repositories/user.repository';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { RegisterInput } from '../../subscriber/dto/register.input';
import { getOrganizationTypeById } from '../../organizationType/services/organizationType.service';
import { getEntityManager } from '../../../database/getEntityManager';
import { getSubscriberRepository } from '../../subscriber/repositories/subscriber.repository';
import {
  getContactDetailRepository,
  isEmailExsiting,
  isPhoneNumberExsiting,
} from '../../users/repositories/contact-detail.repository';
import { SubscriberTypes } from '../../users/types/user.types';
import { isEmpty, omit } from 'lodash';
import { getAdministratorByUserName } from '../../admin/repositories/administrator.repository';
import { getUserByUsername } from '../../users/services/user.service';

export const login = async (input: AuthUserInput): Promise<{ user: Record<string, unknown>; token: string }> => {
  const user = await getOneUserByUsername(input.username);
  if (!user) {
    throw new UnauthorizedException('Invalid username/password');
  }
  const match = compareSync(input.password, user.password);
  if (!match) {
    throw new UnauthorizedException('Invalid username/password');
  }
  if (!user.isActive) {
    throw new UnauthorizedException('User is not active, kindly contact administrator');
  }

  //Generate jwt token
  const token = sign(
    { username: user.username, subscriber: user.subscriber },
    process.env.JWT_SECRET || 'lawnovus-api',
    {
      algorithm: 'HS256',
      expiresIn: '1d',
      subject: user.username,
    },
  );

  return {
    token,
    user: {
      ...omit(user, ['password']),
      role: 'subscriber',
    },
  };
};

export const adminLogin = async (input: AuthUserInput): Promise<{ user: Record<string, unknown>; token: string }> => {
  const admin = await getAdministratorByUserName(input.username);
  if (!admin) {
    throw new UnauthorizedException('Invalid username/password');
  }
  const { user } = admin;
  const match = compareSync(input.password, user.password);
  if (!match) {
    throw new UnauthorizedException('Invalid username/password');
  }
  if (!user.isActive) {
    throw new UnauthorizedException('User is not active, kindly contact administrator');
  }

  //Generate jwt token
  const token = sign(
    { username: user.username, subscriber: user.subscriber },
    process.env.JWT_SECRET || 'lawnovus-api',
    {
      algorithm: 'HS256',
      expiresIn: '1d',
      subject: user.username,
    },
  );

  return {
    token,
    user: {
      ...omit(user, ['password']),
      role: admin?.type,
    },
  };
};

export const register = async (input: RegisterInput) => {
  const userRepository = await getUserRepository();
  const subscriberRepository = await getSubscriberRepository();
  const contactDetailRepository = await getContactDetailRepository();
  let organizationType;
  if (input.subscriberType === SubscriberTypes.INSTITUTIONAL) {
    organizationType = await getOrganizationTypeById(input.organizationTypeId);
  }
  const [user, emailExist, phoneExist] = await Promise.all([
    getOneUserByUsername(input.username),
    isEmailExsiting(input.contactDetail.email),
    isPhoneNumberExsiting(input?.institutionPhone || input.contactDetail.phone),
  ]);

  if (user) {
    throw new ConflictException('username already exist');
  }

  if (emailExist) {
    throw new ConflictException('email already exist');
  }

  if (phoneExist) {
    throw new ConflictException('phone already exist');
  }
  const salt = genSaltSync(10);
  const hashPassword = hashSync(input.password, salt);
  const entityManager = await getEntityManager();
  return await entityManager.transaction(async (transaction) => {
    const subscriberToInsert = subscriberRepository.create({
      organizationType: organizationType || null,
      name: input.name,
      type: input.subscriberType,
      phone: input.institutionPhone || '',
      address: input.institutionAddress || '',
      isActive: true,
    });
    const newSubscriber = await transaction.save(subscriberToInsert);
    const contactDetailToInsert = contactDetailRepository.create({
      ...input.contactDetail,
      isContactPerson: true,
    });
    const newContactDetail = await transaction.save(contactDetailToInsert);
    const userToInsert = userRepository.create({
      username: input.username,
      password: hashPassword,
      name: input.name,
      subscriber: newSubscriber,
      contactDetail: newContactDetail,
      isActive: true,
    });
    const newUser = await transaction.save(userToInsert);
    return { user: omit(newUser, ['password']), subscriber: newSubscriber, contactDetail: newContactDetail };
  });
};

export const validateToken = async (token: string) => {
  if (isEmpty(token)) {
    throw new UnauthorizedException('No Token Provided');
  }
  if (!token.includes('Bearer')) {
    throw new UnauthorizedException('invalid Bearer token');
  }
  const splitToken = token.split(' ')[1];

  const tokenValue = verify(splitToken, process.env.JWT_SECRET || 'lawnovus-api') as JwtPayload;

  const username = tokenValue.sub || '';

  if (isEmpty(username)) {
    throw new UnauthorizedException('invalid token');
  }

  const [admin, user] = await Promise.all([getAdministratorByUserName(username), getUserByUsername(username)]);

  const validatdUser = {
    ...omit(user, ['subscriber', 'password']),
    role: admin?.type || 'subscriber',
  };

  return validatdUser;
};
