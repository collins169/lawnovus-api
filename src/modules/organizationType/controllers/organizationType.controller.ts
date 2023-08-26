import { Response } from 'express';
import { AuthenticatedRequest } from '../../../common/types';
import {
  addOrganizationType,
  deleteMultipleOrganizationType,
  deleteOrganizationType,
  editOrganizationType,
  getOrganizationTypeById,
  getOrganizationTypes,
  updateOrganizationTypeStatus,
} from '../services/organizationType.service';
import { HttpStatus } from '@nestjs/common';
import { OrganizationTypeInput } from '../dto/organizationType.input';
import { OrganizationTypeStatus } from '../types';

export const getOrganizationTypeByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const orgType = await getOrganizationTypeById(id);
  return res.status(HttpStatus.OK).json(orgType);
};

export const getOrganizationTypesCtrl = async (_: AuthenticatedRequest, res: Response) => {
  const orgTypes = await getOrganizationTypes();
  return res.status(HttpStatus.OK).json(orgTypes);
};

export const addOrganizationTypeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body as OrganizationTypeInput;

  await addOrganizationType({
    name,
    description,
  });
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const editOrganizationTypeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body as OrganizationTypeInput;

  await editOrganizationType(id, {
    name,
    description,
  });
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteOrganizationTypeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  //check if the id contains multiple ids
  if (id.includes('+')) {
    const ids = id.split('+');
    await deleteMultipleOrganizationType(ids);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  await deleteOrganizationType(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const changeOrganizationTypeStatusCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id, status } = req.params;

  await updateOrganizationTypeStatus(id, status as OrganizationTypeStatus);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
