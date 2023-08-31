import { Response } from 'express';
// import { AddUserInput } from '../dto/addUser.input';
import { UserRole } from '../types/user.types';
import { BadRequestException, HttpStatus } from '@nestjs/common';
// import { createUser, getUserById, getUsers } from '../services/user.service';
import { AuthenticatedRequest } from '../../../common/types';

// export const addUserCtrl = async (req: AuthenticatedRequest, res: Response) => {
//   const { userRole, body: input } = req;

//   if (input.role === UserRole.ADMIN) {
//     throw new BadRequestException('you are not permitted to add this user');
//   }
//   if (input.role === UserRole.OFFICER && userRole === UserRole.OFFICER) {
//     throw new BadRequestException('you are not permitted to add this user');
//   }
//   await createUser({
//     ...input,
//   });
//   return res.sendStatus(HttpStatus.NO_CONTENT);
// };

// export const getUserByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
//   const {
//     userRole,
//     user: { id: userId, role },
//     params: { id },
//   } = req;

//   const user = await getUserById(id || userId);
//   if (role !== userRole) {
//     if (user.role === UserRole.AGENT && ![UserRole.ADMIN, UserRole.OFFICER].includes(userRole)) {
//       throw new BadRequestException('you are not permitted to view this user');
//     }
//     if (user.role === UserRole.OFFICER && UserRole.ADMIN !== userRole) {
//       throw new BadRequestException('you are not permitted to view this user');
//     }
//   }
//   return res.status(HttpStatus.OK).json(user);
// };

// export const getUsersCtrl = async (req: AuthenticatedRequest, res: Response) => {
//   const { userRole } = req;
//   if (UserRole.AGENT === userRole) {
//     throw new BadRequestException('you are not permitted to view this user');
//   }
//   const roleMap = {
//     [UserRole.OFFICER]: [UserRole.AGENT],
//     [UserRole.ADMIN]: [UserRole.OFFICER, UserRole.AGENT],
//   };
//   const users = await getUsers(roleMap[userRole]);
//   return res.status(HttpStatus.OK).json(users);
// };
