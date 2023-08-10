import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthUserInput } from '../dto/authUser.input';
import { getOneUserByUsername, getUserRepository } from '../../users/repositories/user.repository';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../../users/entities/user.entity';
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
import { omit } from 'lodash';

export const login = async (input: AuthUserInput): Promise<{ user: Partial<User>; token: string }> => {
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
    user: omit(user, ['password']),
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
