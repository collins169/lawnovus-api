import { Response } from 'express';
import { AuthenticatedRequest } from '../../../common/types';
import {
  changeSubscriberStatus,
  createSubscriber,
  deleteMultipleSubscriber,
  deleteSubscriber,
  getAllSubscribers,
  getSubscriberById,
} from '../services/subscriber.service';
import { RegisterInput } from '../dto/register.input';
import { HttpStatus } from '@nestjs/common';
import { UpdateStatusRequest } from '../dto/updateStatus.input';

export const createSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    body: input,
    user: { id },
  } = req;
  await createSubscriber(input as RegisterInput, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const getAllSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const subscribers = await getAllSubscribers();
  return res.status(HttpStatus.OK).json(subscribers);
};

export const getSubscriberByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const subscriber = await getSubscriberById(id);
  return res.status(HttpStatus.OK).json(subscriber);
};

export const changeSubscriberStatusByIdCtrl = async (req: UpdateStatusRequest, res: Response) => {
  const {
    params: { id, status },
    user: { id: updatedBy },
  } = req;
  const subscriber = await changeSubscriberStatus({ subscriberId: id, status, updatedBy });
  return res.status(HttpStatus.OK).json(subscriber);
};

export const deleteSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  //check if the id contains multiple ids
  if (id.includes('+')) {
    const ids = id.split('+');
    await deleteMultipleSubscriber(ids);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  await deleteSubscriber(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
