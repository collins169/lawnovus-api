import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { map, omit } from 'lodash';
import { getEntityManager } from '../../../database/getEntityManager';
import { getAdministratorByUserId } from '../../admin/repositories/administrator.repository';
import { OrganizationType } from '../../organizationType/entities/organizationType.entity';
import { getOrganizationTypeById } from '../../organizationType/services/organizationType.service';
import {
  getContactDetailRepository,
  isEmailExisting,
  isPhoneNumberExisting,
} from '../../users/repositories/contact-detail.repository';
import { getOneUserByUsername, getUserRepository } from '../../users/repositories/user.repository';
import { SubscriberTypes, UserRole } from '../../users/types/user.types';
import { RegisterInput } from '../dto/register.input';
import {
  deleteSubscriber as deleteSubscriberRepo,
  getAllSubscriber,
  getOneSubscriber,
  getSubscriberRepository,
  isSubscriberPhoneNumberExisting,
  updateSubscriber,
} from '../repositories/subscriber.repository';
import { Status } from '../types';
import { getUserById } from '../../users/services/user.service';
import { CreateSubscriberInput } from '../dto/create.subscriber.input';
import { User } from '../../users/entities/user.entity';
import { UpdateSubscriberUserInput } from '../dto/update.subscriber.user.input';

export const getAllSubscribers = async () => {
  const list = await getAllSubscriber();
  const mappedlist = map(list, (subscriber) => {
    return {
      ...subscriber,
      user: map(subscriber.users, (user) => omit(user, ['password'])),
    };
  });
  return mappedlist;
};

export const getSubscriberById = async (id: string) => {
  const subscriber = await getOneSubscriber(id);
  if (!subscriber) {
    throw new NotFoundException('Subscriber not found');
  }

  return subscriber;
};

export const createSubscriber = async (input: RegisterInput, createdBy?: string) => {
  const userRepository = await getUserRepository();
  const subscriberRepository = await getSubscriberRepository();
  const contactDetailRepository = await getContactDetailRepository();
  let organizationType: OrganizationType;
  if (input.subscriberType === SubscriberTypes.INSTITUTIONAL) {
    organizationType = await getOrganizationTypeById(input.organizationTypeId);
  }
  const [user, emailExist, subscriberPhoneExist, phoneExist, admin] = await Promise.all([
    getOneUserByUsername(input.username),
    isEmailExisting(input.contactDetail.email),
    isSubscriberPhoneNumberExisting(input?.institutionPhone),
    isPhoneNumberExisting(input.contactDetail.phone),
    getAdministratorByUserId(createdBy),
  ]);

  if (user) {
    throw new ConflictException('username already exist');
  }

  if (emailExist) {
    throw new ConflictException('contact person email already exist');
  }

  if (subscriberPhoneExist) {
    throw new ConflictException('institutional phone number already exist');
  }

  if (phoneExist) {
    throw new ConflictException('contact person phone already exist');
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
      createdBy: admin,
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
      role: UserRole.SUBSCRIBER,
      isActive: true,
    });
    const newUser = await transaction.save(userToInsert);
    return { user: omit(newUser, ['password']), subscriber: newSubscriber, contactDetail: newContactDetail };
  });
};

export const subscriberCreateUser = async (user: User, input: CreateSubscriberInput) => {
  if (user.subscriber.type !== SubscriberTypes.INSTITUTIONAL) {
    // eslint-disable-next-line quotes
    throw new UnauthorizedException("You don't have right to perform this action");
  }
  const userRepository = await getUserRepository();
  const contactDetailRepository = await getContactDetailRepository();
  const [userExist, emailExist, phoneExist, subscriber] = await Promise.all([
    getOneUserByUsername(input.username),
    isEmailExisting(input.contactDetail.email),
    isPhoneNumberExisting(input.contactDetail.phone),
    getSubscriberById(user.subscriber.id),
  ]);

  if (userExist) {
    throw new ConflictException('username already exist');
  }

  if (emailExist) {
    throw new ConflictException('email already exist');
  }

  if (phoneExist) {
    throw new ConflictException('phone already exist');
  }

  if (subscriber) {
    throw new ConflictException('Invalid Subscriber');
  }

  const salt = genSaltSync(10);
  const hashPassword = hashSync(input.password, salt);
  const entityManager = await getEntityManager();
  return await entityManager.transaction(async (transaction) => {
    const contactDetailToInsert = contactDetailRepository.create({
      ...input.contactDetail,
      isContactPerson: false,
    });
    const newContactDetail = await transaction.save(contactDetailToInsert);
    const userToInsert = userRepository.create({
      username: input.username,
      password: hashPassword,
      name: newContactDetail.name,
      subscriber,
      contactDetail: newContactDetail,
      isActive: true,
    });
    const newUser = await transaction.save(userToInsert);
    return { user: newUser.toJSON(), subscriber, contactDetail: newContactDetail };
  });
};

export const subscriberUpdateUser = async (user: User, input: UpdateSubscriberUserInput) => {
  if (user.subscriber.type !== SubscriberTypes.INSTITUTIONAL) {
    // eslint-disable-next-line quotes
    throw new UnauthorizedException("You don't have right to perform this action");
  }
  const userRepository = await getUserRepository();
  const contactDetailRepository = await getContactDetailRepository();
  const [emailExist, phoneExist, subscriber] = await Promise.all([
    isEmailExisting(input.contactDetail.email),
    isPhoneNumberExisting(input.contactDetail.phone),
    getSubscriberById(user.subscriber.id),
  ]);

  if (emailExist) {
    throw new ConflictException('email already exist');
  }

  if (phoneExist) {
    throw new ConflictException('phone already exist');
  }

  if (subscriber) {
    throw new ConflictException('Invalid Subscriber');
  }

  const entityManager = await getEntityManager();
  return await entityManager.transaction(async (transaction) => {
    const user = await getUserById(input.userId);
    const contactDetailToUpdate = contactDetailRepository.merge(user.contactDetail, {
      ...input.contactDetail,
    });
    const newContactDetail = await transaction.save(contactDetailToUpdate);

    const userToUpdate = userRepository.merge(user, {
      name: newContactDetail.name,
      subscriber,
      contactDetail: newContactDetail,
      isActive: input.status,
    });
    const newUser = await transaction.save(userToUpdate);
    return { user: newUser.toJSON(), subscriber, contactDetail: newContactDetail };
  });
};

export const changeSubscriberStatus = async ({
  subscriberId,
  status,
  updatedBy,
}: {
  subscriberId: string;
  status: Status;
  updatedBy: string;
}) => {
  // TODO implement this method to update the status of a given Subscriber in database based on its ID
  const subscriber = await getOneSubscriber(subscriberId);
  if (!subscriber) {
    throw new NotFoundException('Subscriber not found');
  }
  await updateSubscriber(subscriber, { isActive: status === 'ACTIVATE' }, updatedBy);
};

export const deleteSubscriber = async (id: string) => {
  const subscriber = await getOneSubscriber(id);
  if (!subscriber) {
    throw new NotFoundException(`subscriber with id: ${id} is not found`);
  }
  return await deleteSubscriberRepo(id);
};

export const deleteMultipleSubscriber = async (ids: string[]) => {
  return await deleteSubscriberRepo(ids);
};

export const subscriberChangePassword = async ({
  user,
  password,
  confirmPassword,
}: {
  user: User;
  password: string;
  confirmPassword: string;
}) => {
  const subscriber = await getOneSubscriber(user.subscriber.id);
  if (!subscriber) {
    throw new NotFoundException(`subscriber with id: ${user.subscriber.id} is not found`);
  }
  const userRepository = await getUserRepository();
  if (password !== confirmPassword) {
    throw new BadRequestException('Password and confirm password not the same');
  }
  const userExisting = await getUserById(user.id);
  if (!user) {
    throw new NotFoundException('User was not found');
  }
  const isPasswordSame = compareSync(password, user.password);

  if (isPasswordSame) {
    throw new ConflictException('Password can not be the same as old password');
  }
  const salt = genSaltSync(10);
  const hashPassword = hashSync(password, salt);
  const userToMerge = userRepository.merge(userExisting, {
    password: hashPassword,
  });

  await userRepository.save(userToMerge);
};

export const getSubscriberUsers = async (user: User) => {
  const subscriber = await getOneSubscriber(user.subscriber.id);

  return subscriber.users;
};
