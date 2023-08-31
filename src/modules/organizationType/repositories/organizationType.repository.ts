import { getEntityRepository } from '../../../database/getEntityRepository';
import { OrganizationType } from '../entities/organizationType.entity';

export const getOrganizationTypeRepository = async () => {
  return await getEntityRepository(OrganizationType);
};

export const createType = async ({ name, description }: Pick<OrganizationType, 'name' | 'description'>) => {
  const repository = await getOrganizationTypeRepository();
  const insert = repository.create({
    name,
    description,
  });
  return await repository.save(insert);
};

export const getTypeById = async (id: string) => {
  const repository = await getOrganizationTypeRepository();
  return await repository.findOne({
    where: {
      id,
    },
  });
};

export const getAllType = async () => {
  const repository = await getOrganizationTypeRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
  });
};

export const updateType = async ({ old, input }: { input: Partial<OrganizationType>; old: OrganizationType }) => {
  const repository = await getOrganizationTypeRepository();
  const typeToUpdate = repository.merge(old, input);
  return await repository.save(typeToUpdate);
};

export const deleteType = async (id: string | string[]) => {
  const repository = await getOrganizationTypeRepository();
  return await repository.softDelete(id);
};
