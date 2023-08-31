import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import {
  createCaseStudy,
  getAllCaseStudies,
  getOneCaseStudyById,
  updateCaseStudy,
} from '../services/case-study.service';
import { HttpStatus } from '@nestjs/common';
import { CreateCaseStudyInput } from '../dto/create-case-study.input';
import { deleteCaseStudy } from '../repositories/case-study.repository';

export const getAllCaseStudiesCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const articles = await getAllCaseStudies();
  return res.status(HttpStatus.OK).json(articles);
};

export const getOneCaseStudyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const article = await getOneCaseStudyById(id);
  return res.status(HttpStatus.OK).json(article);
};

export const createCaseStudyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateCaseStudyInput;

  await createCaseStudy(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateCaseStudyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateCaseStudyInput;

  await updateCaseStudy(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteCaseStudyCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteCaseStudy(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
