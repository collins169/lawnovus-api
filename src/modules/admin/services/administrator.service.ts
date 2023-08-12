import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { isEmpty, omit } from 'lodash';
import { getEntityManager } from '../../../database/getEntityManager';
import { AuthUserInput } from '../../auth/dto/authUser.input';
import { User } from '../../users/entities/user.entity';
import {
  getContactDetailRepository,
  isEmailExsiting,
  isPhoneNumberExsiting,
} from '../../users/repositories/contact-detail.repository';
import { getUserRepository } from '../../users/repositories/user.repository';
import { AddAdminInput } from '../dto/addAdmin.input';
import { Administrator } from '../entities/administrator.entity';
import {
  getAdministratorById,
  getAdministratorByUserName,
  getAdministratorRepository,
  getAdministratorUsers,
} from '../repositories/administrator.repository';

export const adminLogin = async (
  input: AuthUserInput,
): Promise<{ user: Partial<User> & Partial<Administrator>; token: string }> => {
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
      ...admin,
      ...omit(user, ['password']),
    },
  };
};

export const addAdmin = async (input: AddAdminInput, createdBy: string) => {
  const userRepository = await getUserRepository();
  const administratorRepository = await getAdministratorRepository();
  const contactDetailRepository = await getContactDetailRepository();
  const [user, emailExist, phoneExist] = await Promise.all([
    getAdministratorByUserName(input.username),
    isEmailExsiting(input.contactDetail.email),
    isPhoneNumberExsiting(input.contactDetail.phone),
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
    const contactDetailToInsert = contactDetailRepository.create({
      ...input.contactDetail,
      isContactPerson: true,
    });
    const newContactDetail = await transaction.save(contactDetailToInsert);
    const userToInsert = userRepository.create({
      name: input.contactDetail.name,
      username: input.username,
      password: hashPassword,
      contactDetail: newContactDetail,
      isActive: true,
    });
    const newUser = await transaction.save(userToInsert);

    const adminToInsert = administratorRepository.create({
      type: input.role,
      user: newUser,
    });
    await transaction.save(adminToInsert);
    return { user: omit(newUser, ['password']), contactDetail: newContactDetail };
  });
};

export const changeAdminPassword = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const userRepository = await getUserRepository();
  if (oldPassword === newPassword) {
    throw new ConflictException('New password cannot be the same as old password');
  }
  const admin = await getAdministratorById(id);
  if (!admin) {
    throw new NotFoundException('Administrator not found');
  }
  const {
    user: { password },
  } = admin;
  const isPasswordSame = compareSync(oldPassword, password);

  if (!isPasswordSame) {
    throw new UnauthorizedException('Old password is not correct');
  }
  const salt = genSaltSync(10);
  const hashPassword = hashSync(newPassword, salt);
  const userToMerge = userRepository.merge(admin.user, {
    password: hashPassword,
  });

  await userRepository.save(userToMerge);
};

export const listAdminUser = async () => {
  return await getAdministratorUsers();
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

  return await getAdministratorByUserName(username);
};
