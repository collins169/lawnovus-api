import { NotFoundException } from '@nestjs/common';
import * as legislationRepo from '../repositories/legislation.repository';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';
import { Legislation } from '../entities/legislation.entity';
import { CreateLegislationInput } from '../dto/create-legislation.input';

export const getLegislation = async () => {
  const legislationList = await legislationRepo.getAllLegislation();
  const mappedLegislationList = await Promise.all(
    legislationList.map(async (legislation) => {
      const [coverImageUrl, fileUrl] = await Promise.all([
        getS3Instant().getObjectPresignedUrl(legislation?.coverImage?.key, TEN_MINUTES),
        getS3Instant().getObjectPresignedUrl(legislation?.file?.key, TEN_MINUTES),
      ]);
      return {
        ...legislation,
        file: {
          ...legislation?.file,
          url: fileUrl,
        },
        coverImage: {
          ...legislation?.coverImage,
          url: coverImageUrl,
        },
      };
    }),
  );
  return mappedLegislationList;
};

export const getOneLegislationById = async (id: string) => {
  const legislation: Legislation = await legislationRepo.getLegislationById(id);
  if (!legislation) {
    throw new NotFoundException('this legislation does not exist');
  }
  const [coverImageUrl, fileUrl] = await Promise.all([
    getS3Instant().getObjectPresignedUrl(legislation?.coverImage?.key, TEN_MINUTES),
    getS3Instant().getObjectPresignedUrl(legislation?.file?.key, TEN_MINUTES),
  ]);
  return {
    ...legislation,
    file: {
      ...legislation?.file,
      url: fileUrl,
    },
    coverImage: {
      ...legislation?.coverImage,
      url: coverImageUrl,
    },
  };
};

export const createLegislation = async (
  { coverImage, file, type, ...input }: CreateLegislationInput,
  createdBy: string,
) => {
  const [coverImg, legislationFile, category] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
  ]);
  const admin = await getAdministratorByUserId(createdBy);
  await legislationRepo.saveLegislation({
    ...input,
    file: legislationFile,
    type: category,
    coverImage: coverImg,
    createdBy: admin,
  });
};

export const updateLegislation = async (
  id: string,
  { coverImage, file, type, ...input }: Partial<CreateLegislationInput>,
  updatedBy: string,
) => {
  const [coverImg, legislationFile, category, legislation] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
    legislationRepo.getLegislationById(id),
  ]);
  if (!legislation) {
    throw new NotFoundException('this legislation does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await legislationRepo.updateLegislation({
    old: legislation,
    input: {
      ...input,
      file: legislationFile,
      type: category,
      coverImage: coverImg,
      updatedBy: admin,
    },
  });
};

export const deleteLegislation = async (id: string) => {
  const legislation: Legislation = await legislationRepo.getLegislationById(id);
  if (!legislation) {
    throw new NotFoundException('this legislation does not exist');
  }

  await legislationRepo.deleteLegislation(id);
};
