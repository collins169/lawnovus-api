import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  getAllSubscriber,
  getOneSubscriber,
  getSubscriberRepository,
  updateSubscriber,
} from '../repositories/subscriber.repository';
import { genSaltSync, hashSync } from 'bcryptjs';
import { map, omit } from 'lodash';
import { getEntityManager } from '../../../database/getEntityManager';
import { RegisterInput } from '../dto/register.input';
import { getOrganizationTypeById } from '../../organizationType/services/organizationType.service';
import {
  getContactDetailRepository,
  isEmailExsiting,
  isPhoneNumberExsiting,
} from '../../users/repositories/contact-detail.repository';
import { getUserRepository, getOneUserByUsername } from '../../users/repositories/user.repository';
import { SubscriberTypes } from '../../users/types/user.types';
import { Status } from '../types';
import { OrganizationType } from '../../organizationType/entities/organizationType.entity';

export const getAllSubcribers = async () => {
  const list = await getAllSubscriber();
  return list.map((subscriber) => map(subscriber.users, (user) => omit(user, ['password'])));
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
      createdBy: {
        id: createdBy,
      },
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
