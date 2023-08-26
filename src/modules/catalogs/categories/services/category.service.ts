import { NotFoundException } from '@nestjs/common';
import { Category } from '../entities/category';
import * as catRepo from '../repositories/category.repository';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { CategoryTypeEnum } from '../../types';

export const addCategory = async ({ type, name, description }: Partial<Category>, createdBy: string) => {
  const admin = await getAdministratorByUserId(createdBy);
  return await catRepo.createCategory({ type, name, description, createdBy: admin });
};

export const getOneCategoryById = async (id: string) => {
  const category = await catRepo.getCategoryById(id);
  if (!category) {
    throw new NotFoundException(`category with id: ${id} is not found`);
  }
  return category;
};

export const getAllCategoriesByType = async (type: string) => {
  return await catRepo.getCategoriesByType(type as CategoryTypeEnum);
};

export const getCategories = async () => {
  return await catRepo.getAllCategories();
};

export const editCategory = async ({
  id,
  input,
  updatedBy,
}: {
  id: string;
  input: Partial<Category>;
  updatedBy: string;
}) => {
  const { name, description } = input;
  const [category, admin] = await Promise.all([catRepo.getCategoryById(id), getAdministratorByUserId(updatedBy)]);
  if (!category) {
    throw new NotFoundException(`Category with id: ${id} is not found`);
  }
  return await catRepo.updateCategory({
    old: category,
    input: {
      name,
      description,
      updatedBy: admin,
    },
  });
};

// export const updateOrganizationTypeStatus = async (id: string, status: OrganizationTypeStatus) => {
//   const organizationType = await getTypeById(id);
//   if (!organizationType) {
//     throw new NotFoundException(`organization type with id: ${id} is not found`);
//   }
//   return await updateType({
//     old: organizationType,
//     input: {
//       isActive: status === 'ACTIVATE' ? true : false,
//     },
//   });
// };

export const deleteCategory = async (id: string) => {
  const category = await catRepo.getCategoryById(id);
  if (!category) {
    throw new NotFoundException(`Category with id: ${id} is not found`);
  }
  return await catRepo.deleteCategory(id);
};

export const deleteMultipleCategories = async (ids: string[]) => {
  return await catRepo.deleteCategory(ids);
};
