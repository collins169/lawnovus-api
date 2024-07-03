import { Request } from 'express';
import { UserRole } from '../../modules/users/types/user.types';
import { Administrator } from '../../modules/admin/entities/administrator.entity';
import { APIGatewayEvent } from 'aws-lambda';
import { User } from '../../modules/users/entities/user.entity';

export type AuthenticatedRequest = Request & {
  userRole: UserRole;
  user: User;
  administrator: Administrator;
  apiGateway?: {
    event: APIGatewayEvent;
  };
};
