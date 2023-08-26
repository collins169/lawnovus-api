import { getEntityRepository } from '../../../../database/getEntityRepository';
import { CategoryTypeEnum } from '../../types';
import { Category } from '../entities/category';

export const getCategoryRepository = async () => {
  return await getEntityRepository(Category);
};

export const createCategory = async ({ type, name, description, createdBy }: Partial<Category>) => {
  const repository = await getCategoryRepository();
  const insert = repository.create({
    type,
    name,
    description,
    createdBy,
  });
  return await repository.save(insert);
};

export const getCategoryById = async (id: string) => {
  const repository = await getCategoryRepository();
  return await repository.findOne({
    where: {
      id,
    },
  });
};

export const getCategoriesByType = async (type: CategoryTypeEnum) => {
  const repository = await getCategoryRepository();
  return await repository.find({
    where: {
      type,
    },
  });
};

export const getAllCategories = async () => {
  const repository = await getCategoryRepository();
  return await repository.find({
    order: {
      name: 'ASC',
    },
  });
};

export const updateCategory = async ({ old, input }: { input: Partial<Category>; old: Category }) => {
  const repository = await getCategoryRepository();
  const categoryToUpdate = repository.merge(old, input);
  return await repository.save(categoryToUpdate);
};

export const deleteCategory = async (id: string | string[]) => {
  const repository = await getCategoryRepository();
  return await repository.softDelete(id);
};
