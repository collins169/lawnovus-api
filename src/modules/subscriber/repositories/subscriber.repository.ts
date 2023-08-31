import { getEntityRepository } from '../../../database/getEntityRepository';
import { Subscriber } from '../entities/subscriber.entity';

export const getSubscriberRepository = async () => {
  return await getEntityRepository(Subscriber);
};

export const getOneSubscriber = async (id: string) => {
  const repository = await getSubscriberRepository();
  return repository.findOne({
    where: {
      id,
    },
    relations: ['users', 'users.contactDetail', 'organizationType'],
  });
};

export const getAllSubscriber = async () => {
  const repository = await getSubscriberRepository();
  return repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['users', 'users.contactDetail'],
  });
};

export const getOneSubscriberByUsername = async (username: string) => {
  const repository = await getSubscriberRepository();
  return repository.findOne({
    where: {
      users: {
        username: username.toLowerCase(),
      },
    },
    relations: ['users', 'users.contactDetail'],
  });
};

export const updateSubscriber = async (oldRecord: Subscriber, input: Partial<Subscriber>, updatedBy?: string) => {
  const repository = await getSubscriberRepository();

  const subscriberToUpdate = repository.merge(oldRecord, { ...input, updatedBy: { id: updatedBy } });
  return await repository.save(subscriberToUpdate);
};

export const isSubscriberPhoneNumberExisting = async (phone: string) => {
  const repository = await getSubscriberRepository();
  const subscriber = await repository.findOne({
    where: {
      phone,
    },
  });
  return !!subscriber;
};

export const deleteSubscriber = async (id: string | string[]) => {
  const repository = await getSubscriberRepository();
  return repository.softDelete(id);
};
