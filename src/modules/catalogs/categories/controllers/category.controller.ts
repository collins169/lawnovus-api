import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { CategoryTypeInput } from '../dto/category.input';
import {
  addCategory,
  deleteCategory,
  deleteMultipleCategories,
  editCategory,
  getAllCategoriesByType,
  getCategories,
  getOneCategoryById,
} from '../services/category.service';
import { AuthenticatedRequest } from '../../../../common/types';

export const getCategoryByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const category = await getOneCategoryById(id);
  return res.status(HttpStatus.OK).json(category);
};

export const getCategoriesCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.query;
  if (type) {
    const orgTypes = await getAllCategoriesByType(type as string);
    return res.status(HttpStatus.OK).json(orgTypes);
  }
  const orgTypes = await getCategories();
  return res.status(HttpStatus.OK).json(orgTypes);
};

export const addCategoryCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { type, name, description } = req.body as CategoryTypeInput;
  const {
    user: { id },
  } = req;

  await addCategory(
    {
      type,
      name,
      description,
    },
    id,
  );
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const editCategoryCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const { name, description } = req.body as CategoryTypeInput;

  await editCategory({
    id,
    input: {
      name,
      description,
    },
    updatedBy,
  });
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteCategoryTypeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  //check if the id contains multiple ids
  if (id.includes('+')) {
    const ids = id.split('+');
    await deleteMultipleCategories(ids);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  await deleteCategory(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

// export const changeOrganizationTypeStatusCtrl = async (req: AuthenticatedRequest, res: Response) => {
//   const { id, status } = req.params;

//   await updateOrganizationTypeStatus(id, status as OrganizationTypeStatus);
//   return res.sendStatus(HttpStatus.NO_CONTENT);
// };
