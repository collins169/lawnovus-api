import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import { createTreaty, getAllTreaties, getOneTreatyById, updateTreaty } from '../services/treaties.service';
import { HttpStatus } from '@nestjs/common';
import { CreateTreatyInput } from '../dto/create-treaty.input';
import { deleteTreaty } from '../repositories/treaties.repository';

export const getAllTreatiesCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const treaties = await getAllTreaties();
  return res.status(HttpStatus.OK).json(treaties);
};

export const getOneTreatyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const treaty = await getOneTreatyById(id);
  return res.status(HttpStatus.OK).json(treaty);
};

export const createTreatyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateTreatyInput;

  await createTreaty(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateTreatyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateTreatyInput;

  await updateTreaty(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteTreatyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteTreaty(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
