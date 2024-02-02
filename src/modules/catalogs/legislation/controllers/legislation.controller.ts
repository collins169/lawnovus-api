import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import {
  createLegislation,
  getLegislation,
  getOneLegislationById,
  updateLegislation,
} from '../services/legislation.service';
import { HttpStatus } from '@nestjs/common';
import { CreateLegislationInput } from '../dto/create-legislation.input';
import { deleteLegislation } from '../repositories/legislation.repository';

export const getAllLegislationCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const articles = await getLegislation();
  return res.status(HttpStatus.OK).json(articles);
};

export const getOneLegislationCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const article = await getOneLegislationById(id);
  return res.status(HttpStatus.OK).json(article);
};

export const createLegislationCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateLegislationInput;

  await createLegislation(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateLegislationCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateLegislationInput;

  await updateLegislation(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteLegislationCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteLegislation(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
