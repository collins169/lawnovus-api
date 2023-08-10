import { Request } from 'express';
import { UserRole } from '../../modules/users/types/user.types';
import { Administrator } from '../../modules/admin/entities/administrator.entity';

export type AuthenticatedRequest = Request & {
  userRole: UserRole;
  user: Administrator;
};
