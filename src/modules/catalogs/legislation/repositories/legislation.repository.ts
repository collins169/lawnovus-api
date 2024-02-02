import { getEntityRepository } from '../../../../database/getEntityRepository';
import { Legislation } from '../entities/legislation.entity';

export const getLegislationRepository = async () => {
  return await getEntityRepository(Legislation);
};

export const saveLegislation = async (input: Omit<Legislation, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getLegislationRepository();
  const legislationToInsert = repository.create({ ...input });
  return await repository.save(legislationToInsert);
};

export const getLegislationById = async (id: string) => {
  const repository = await getLegislationRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getLegislationByType = async (type: string) => {
  const repository = await getLegislationRepository();
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

export const getAllLegislation = async () => {
  const repository = await getLegislationRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const updateLegislation = async ({ old, input }: { input: Partial<Legislation>; old: Legislation }) => {
  const repository = await getLegislationRepository();
  const legislationToUpdate = repository.merge(old, input);
  return await repository.save(legislationToUpdate);
};

export const deleteLegislation = async (id: string | string[]) => {
  const repository = await getLegislationRepository();
  return await repository.softDelete(id);
};
