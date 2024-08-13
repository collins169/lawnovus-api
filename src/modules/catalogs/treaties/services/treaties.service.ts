import { NotFoundException } from '@nestjs/common';
import * as treatyRepo from '../repositories/treaties.repository';
import { Treaty } from '../entities/treaties.entity';
import { CreateTreatyInput } from '../dto/create-treaty.input';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';

export const getAllTreaties = async () => {
  const treaties = await treatyRepo.getTreaties();
  const mappedTreaties = await Promise.all(
    treaties.map(async (treaty) => {
      const fileUrl = await getS3Instant().getObjectPresignedUrl(treaty?.file?.key, TEN_MINUTES);
      return {
        ...treaty,
        file: {
          ...treaty?.file,
          url: fileUrl,
        },
      };
    }),
  );
  return mappedTreaties;
};

export const getOneTreatyById = async (id: string) => {
  const treaty: Treaty = await treatyRepo.getTreatyById(id);
  if (!treaty) {
    throw new NotFoundException('this treaty does not exist');
  }
  const fileUrl = await getS3Instant().getObjectPresignedUrl(treaty?.file?.key, TEN_MINUTES);
  return {
    ...treaty,
    file: {
      ...treaty?.file,
      url: fileUrl,
    },
  };
};

export const createTreaty = async ({ file, type, ...input }: CreateTreatyInput, createdBy: string) => {
  const [treatyFile, category] = await Promise.all([getOneDocument(file), getOneCategoryById(type)]);
  const admin = await getAdministratorByUserId(createdBy);
  await treatyRepo.saveTreaty({
    ...input,
    file: treatyFile,
    type: category,
    createdBy: admin,
  });
};

export const updateTreaty = async (
  id: string,
  { file, type, ...input }: Partial<CreateTreatyInput>,
  updatedBy: string,
) => {
  const [treatyFile, category, treaty] = await Promise.all([
    getOneDocument(file),
    getOneCategoryById(type),
    treatyRepo.getTreatyById(id),
  ]);
  if (!treaty) {
    throw new NotFoundException('this treaty does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await treatyRepo.updateTreaty({
    old: treaty,
    input: {
      ...input,
      file: treatyFile,
      type: category,
      updatedBy: admin,
    },
  });
};

export const deleteTreaty = async (id: string) => {
  const treaty: Treaty = await treatyRepo.getTreatyById(id);
  if (!treaty) {
    throw new NotFoundException('this treaty does not exist');
  }

  await treatyRepo.deleteTreaty(id);
};
