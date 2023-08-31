import { getEntityRepository } from '../../../database/getEntityRepository';
import { User } from '../entities/user.entity';

export const getUserRepository = async () => {
  return await getEntityRepository(User);
};

export const getOneUser = async (id: string) => {
  const repository = await getUserRepository();
  return repository.findOne({
    where: {
      id,
    },
    relations: ['subscriber'],
  });
};

export const getAllSubscriberUser = async () => {
  const repository = await getUserRepository();
  const options: Record<string, any> = {
    where: {},
    order: {
      id: 'ASC',
    },
    relations: ['subscriber'],
  };
  return repository.find(options);
};

export const getOneUserByUsername = async (username: string) => {
  const repository = await getUserRepository();
  return repository.findOne({
    where: {
      username: username.toLowerCase(),
    },
    relations: ['contactDetail', 'subscriber'],
  });
};
