import { NotFoundException } from '@nestjs/common/exceptions';
import { getOneUser, getOneUserByUsername } from '../repositories/user.repository';

export const getUserById = async (id: string) => {
  const user = await getOneUser(id);
  if (!user) {
    throw new NotFoundException(`user with id ${id} not found`);
  }
  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await getOneUserByUsername(username);
  if (!user) {
    throw new NotFoundException(`user with id ${username} not found`);
  }
  return user;
};
