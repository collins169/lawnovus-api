import { Status } from '../types';
import { AuthenticatedRequest } from './../../../common/types/auth';
import { celebrate, Segments, Joi } from 'celebrate';

export const UpdateStatusInputValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
    status: Joi.string().valid('ACTIVATE', 'DEACTIVATE').required(),
  }),
});

export type UpdateStatusRequest = AuthenticatedRequest & {
  params: {
    id: string;
    status: Status;
  };
};
