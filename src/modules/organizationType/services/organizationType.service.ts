import { NotFoundException } from '@nestjs/common';
import {
  createType,
  deleteType,
  getAllType,
  getTypeById,
  updateType,
} from '../repositories/organizationType.repository';
import { OrganizationType } from '../entities/organizationType.entity';
import { OrganizationTypeStatus } from '../types';

export const addOrganizationType = async ({ name, description }: Pick<OrganizationType, 'name' | 'description'>) => {
  return await createType({ name, description });
};

export const getOrganizationTypeById = async (id: string) => {
  const organizationType = await getTypeById(id);
  if (!organizationType) {
    throw new NotFoundException(`organization type with id: ${id} is not found`);
  }
  return organizationType;
};

export const getOrganizationTypes = async () => {
  return await getAllType();
};

export const editOrganizationType = async (
  id: string,
  { name, description }: Pick<OrganizationType, 'name' | 'description'>,
) => {
  const organizationType = await getTypeById(id);
  if (!organizationType) {
    throw new NotFoundException(`organization type with id: ${id} is not found`);
  }
  return await updateType({
    old: organizationType,
    input: {
      name,
      description,
    },
  });
};

export const updateOrganizationTypeStatus = async (id: string, status: OrganizationTypeStatus) => {
  const organizationType = await getTypeById(id);
  if (!organizationType) {
    throw new NotFoundException(`organization type with id: ${id} is not found`);
  }
  return await updateType({
    old: organizationType,
    input: {
      isActive: status === 'ACTIVATE' ? true : false,
    },
  });
};

export const deleteOrganizationType = async (id: string) => {
  const organizationType = await getTypeById(id);
  if (!organizationType) {
    throw new NotFoundException(`organization type with id: ${id} is not found`);
  }
  return await deleteType(id);
};
