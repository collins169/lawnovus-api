import { getEntityRepository } from '../../../database/getEntityRepository';
import { Administrator } from '../entities/administrator.entity';

export const getAdministratorRepository = async () => {
  return await getEntityRepository(Administrator);
};

export const getAdministratorByUserName = async (username: string) => {
  const repository = await getAdministratorRepository();
  const result = await repository.findOne({
    where: {
      user: {
        username,
      },
    },
    relations: ['user'],
  });

  await repository.manager.connection.destroy();
  return result;
};

export const getAdministratorByUserId = async (userId: string) => {
  const repository = await getAdministratorRepository();
  const result = await repository.findOne({
    where: {
      user: {
        id: userId,
      },
    },
    relations: ['user'],
  });
  await repository.manager.connection.destroy();
  return result;
};

export const getAdministratorById = async (id: string) => {
  const repository = await getAdministratorRepository();
  const result = await repository.findOne({
    where: {
      id,
    },
    relations: ['user'],
  });
  await repository.manager.connection.destroy();
  return result;
};

export const getAdministratorUsers = async () => {
  const repository = await getAdministratorRepository();
  const result = await repository.find({
    relations: ['user'],
    order: {
      createdAt: 'DESC',
    },
  });

  await repository.manager.connection.destroy();
  return result;
};

export const deleteAdministrator = async (id: string) => {
  const repository = await getAdministratorRepository();
  const result = await repository.softDelete(id);

  await repository.manager.connection.destroy();
  return result;
};
