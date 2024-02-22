import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import { createNotice, getAllNotices, getOneNoticeById, updateNotice } from '../services/notice.service';
import { HttpStatus } from '@nestjs/common';
import { CreateNoticeInput } from '../dto/create-notice.input';
import { deleteNotice } from '../repositories/notices.repository';

export const getAllNoticesCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const notices = await getAllNotices();
  return res.status(HttpStatus.OK).json(notices);
};

export const getOneNoticeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notice = await getOneNoticeById(id);
  return res.status(HttpStatus.OK).json(notice);
};

export const createNoticeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateNoticeInput;

  await createNotice(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateNoticeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateNoticeInput;

  await updateNotice(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteNoticeCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteNotice(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
