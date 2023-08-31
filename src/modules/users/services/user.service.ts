import { ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import {
  getAllSubscriberUser,
  getOneUser,
  getOneUserByUsername,
  getUserRepository,
} from '../repositories/user.repository';
// import { AddUserInput } from '../dto/addUser.input';
import { genSaltSync, hashSync } from 'bcryptjs';
import { omit } from 'lodash';
import { getEntityManager } from '../../../database/getEntityManager';
import { RegisterInput } from '../../subscriber/dto/register.input';
import { getOrganizationTypeById } from '../../organizationType/services/organizationType.service';
import {
  getContactDetailRepository,
  isEmailExisting,
  isPhoneNumberExisting,
} from '../repositories/contact-detail.repository';
import { getSubscriberRepository } from '../../subscriber/repositories/subscriber.repository';
import { SubscriberTypes } from '../types/user.types';

export const createUser = async (input: RegisterInput) => {
  const userRepository = await getUserRepository();
  const subscriberRepository = await getSubscriberRepository();
  const contactDetailRepository = await getContactDetailRepository();
  let organizationType;
  if (input.subscriberType === SubscriberTypes.INSTITUTIONAL) {
    organizationType = await getOrganizationTypeById(input.organizationTypeId);
  }
  const [user, emailExist, phoneExist] = await Promise.all([
    getOneUserByUsername(input.username),
    isEmailExisting(input.contactDetail.email),
    isPhoneNumberExisting(input?.institutionPhone || input.contactDetail.phone),
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

export const getUserById = async (id: string) => {
  const user = await getOneUser(id);
  if (!user) {
    throw new NotFoundException(`user with id ${id} not found`);
  }
  return user;
};

export const getUsers = async () => await getAllSubscriberUser();

export const getUserByUsername = async (username: string) => {
  const user = await getOneUserByUsername(username);
  if (!user) {
    throw new NotFoundException(`user with id ${username} not found`);
  }
  return user;
};
