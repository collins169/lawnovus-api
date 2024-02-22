import { getEntityRepository } from '../../../../database/getEntityRepository';
import { Treaty } from '../entities/treaties.entity';

export const getTreatyRepository = async () => {
  return await getEntityRepository(Treaty);
};

export const saveTreaty = async (input: Omit<Treaty, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getTreatyRepository();
  const treatyToInsert = repository.create({ ...input });
  return await repository.save(treatyToInsert);
};

export const getTreatyById = async (id: string) => {
  const repository = await getTreatyRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getTreatyByType = async (type: string) => {
  const repository = await getTreatyRepository();
  return await repository.findOne({
    where: {
      type: {
        id: type,
      },
    },
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getTreaties = async () => {
  const repository = await getTreatyRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const updateTreaty = async ({ old, input }: { input: Partial<Treaty>; old: Treaty }) => {
  const repository = await getTreatyRepository();
  const treatyToUpdate = repository.merge(old, input);
  return await repository.save(treatyToUpdate);
};

export const deleteTreaty = async (id: string | string[]) => {
  const repository = await getTreatyRepository();
  return await repository.softDelete(id);
};
