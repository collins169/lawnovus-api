import { Response } from 'express';
import { AuthenticatedRequest } from '../../../common/types';
import * as subscriberService from '../services/subscriber.service';
import { RegisterInput } from '../dto/register.input';
import { HttpStatus } from '@nestjs/common';
import { UpdateStatusRequest } from '../dto/updateStatus.input';
import { changePasswordInput } from '../../../common/dto/changePassword.input';
import { UpdateSubscriberUserInput } from '../dto/update.subscriber.user.input';
import { CreateSubscriberInput } from '../dto/create.subscriber.input';

export const createSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    body: input,
    user: { id },
  } = req;
  await subscriberService.createSubscriber(input as RegisterInput, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const getAllSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const subscribers = await subscriberService.getAllSubscribers();
  return res.status(HttpStatus.OK).json(subscribers);
};

export const getSubscriberByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const subscriber = await subscriberService.getSubscriberById(id);
  return res.status(HttpStatus.OK).json(subscriber);
};

export const changeSubscriberStatusByIdCtrl = async (req: UpdateStatusRequest, res: Response) => {
  const {
    params: { id, status },
    user: { id: updatedBy },
  } = req;
  const subscriber = await subscriberService.changeSubscriberStatus({ subscriberId: id, status, updatedBy });
  return res.status(HttpStatus.OK).json(subscriber);
};

export const deleteSubscriberCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  //check if the id contains multiple ids
  if (id.includes('+')) {
    const ids = id.split('+');
    await subscriberService.deleteMultipleSubscriber(ids);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  await subscriberService.deleteSubscriber(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const subscriberChangePassword = async (req: AuthenticatedRequest, res: Response) => {
  const { body, user } = req;
  const input = body as changePasswordInput;
  await subscriberService.subscriberChangePassword({
    user,
    ...input,
  });
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const subscriberUpdateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { body, user } = req;
  const input = body as UpdateSubscriberUserInput;
  await subscriberService.subscriberUpdateUser(user, input);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const subscriberCreateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { body, user } = req;
  const input = body as CreateSubscriberInput;
  await subscriberService.subscriberCreateUser(user, input);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const getSubscriberUsers = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  const users = await subscriberService.getSubscriberUsers(user);
  return res.status(HttpStatus.OK).json(users);
};
