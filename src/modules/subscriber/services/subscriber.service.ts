import { ConflictException, NotFoundException } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
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
import { SubscriberTypes } from '../../users/types/user.types';
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
  console.log('validation done');
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
      isActive: true,
    });
    const newUser = await transaction.save(userToInsert);
    return { user: omit(newUser, ['password']), subscriber: newSubscriber, contactDetail: newContactDetail };
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
