import { getEntityRepository } from '../../../database/getEntityRepository';
import { Administrator } from '../entities/administrator.entity';

export const getAdministratorRepository = async () => {
  return await getEntityRepository(Administrator);
};

export const getAdministratorByUserName = async (username: string) => {
  const repository = await getAdministratorRepository();
  return await repository.findOne({
    where: {
      user: {
        username,
      },
    },
    relations: ['user'],
  });
};

export const getAdministratorByUserId = async (userId: string) => {
  const repository = await getAdministratorRepository();
  return await repository.findOne({
    where: {
      user: {
        id: userId,
      },
    },
    relations: ['user'],
  });
};

export const getAdministratorById = async (id: string) => {
  const repository = await getAdministratorRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['user'],
  });
};

export const getAdministratorUsers = async () => {
  const repository = await getAdministratorRepository();
  return await repository.find({
    relations: ['user'],
    order: {
      createdAt: 'DESC',
    },
  });
};

export const deleteAdministrator = async (id: string) => {
  const repository = await getAdministratorRepository();
  return await repository.softDelete(id);
};
