import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { isEmpty, omit } from 'lodash';
import { getEntityManager } from '../../../database/getEntityManager';
import {
  getContactDetailRepository,
  isEmailExsiting,
  isPhoneNumberExsiting,
} from '../../users/repositories/contact-detail.repository';
import { getUserRepository } from '../../users/repositories/user.repository';
import { AddAdminInput } from '../dto/addAdmin.input';
import {
  getAdministratorById,
  getAdministratorByUserName,
  getAdministratorRepository,
  getAdministratorUsers,
} from '../repositories/administrator.repository';

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
  const list = await getAdministratorUsers();
  return list.map((admin) => omit(admin, ['password']));
};
