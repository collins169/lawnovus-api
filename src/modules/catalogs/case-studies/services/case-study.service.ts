import { NotFoundException } from '@nestjs/common';
import * as caseStudyRepo from '../repositories/case-study.repository';
import { CaseStudy } from '../entities/case-studies';
import { CreateCaseStudyInput } from '../dto/create-case-study.input';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';

export const getAllCaseStudies = async () => {
  const caseStudies = await caseStudyRepo.getCaseStudies();
  const mappedCaseStudies = await Promise.all(
    caseStudies.map(async (caseStudy) => {
      const [coverImageUrl, fileUrl] = await Promise.all([
        getS3Instant().getObjectPresignedUrl(caseStudy?.coverImage?.key, TEN_MINUTES),
        getS3Instant().getObjectPresignedUrl(caseStudy?.file?.key, TEN_MINUTES),
      ]);
      return {
        ...caseStudy,
        file: {
          ...caseStudy?.file,
          url: fileUrl,
        },
        coverImage: {
          ...caseStudy?.coverImage,
          url: coverImageUrl,
        },
      };
    }),
  );
  return mappedCaseStudies;
};

export const getOneCaseStudyById = async (id: string) => {
  const caseStudy: CaseStudy = await caseStudyRepo.getCaseStudyById(id);
  if (!caseStudy) {
    throw new NotFoundException('this caseStudy does not exist');
  }
  const [coverImageUrl, fileUrl] = await Promise.all([
    getS3Instant().getObjectPresignedUrl(caseStudy?.coverImage?.key, TEN_MINUTES),
    getS3Instant().getObjectPresignedUrl(caseStudy?.file?.key, TEN_MINUTES),
  ]);
  return {
    ...caseStudy,
    file: {
      ...caseStudy?.file,
      url: fileUrl,
    },
    coverImage: {
      ...caseStudy?.coverImage,
      url: coverImageUrl,
    },
  };
};

export const createCaseStudy = async (
  { coverImage, file, type, ...input }: CreateCaseStudyInput,
  createdBy: string,
) => {
  let coverImg = null;
  const [caseStudyFile, category, admin] = await Promise.all([
    getOneDocument(file),
    getOneCategoryById(type),
    getAdministratorByUserId(createdBy),
  ]);
  if (coverImage) {
    coverImg = await getOneDocument(coverImage);
  }
  await caseStudyRepo.saveCaseStudy({
    ...input,
    file: caseStudyFile,
    type: category,
    coverImage: coverImg,
    createdBy: admin,
  });
};

export const updateCaseStudy = async (
  id: string,
  { coverImage, file, type, ...input }: Partial<CreateCaseStudyInput>,
  updatedBy: string,
) => {
  const [coverImg, caseStudyFile, category, caseStudy] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
    caseStudyRepo.getCaseStudyById(id),
  ]);
  if (!caseStudy) {
    throw new NotFoundException('this caseStudy does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await caseStudyRepo.updateCaseStudy({
    old: caseStudy,
    input: {
      ...input,
      file: caseStudyFile,
      type: category,
      coverImage: coverImg,
      updatedBy: admin,
    },
  });
};

export const deleteCaseStudy = async (id: string) => {
  const caseStudy: CaseStudy = await caseStudyRepo.getCaseStudyById(id);
  if (!caseStudy) {
    throw new NotFoundException('this caseStudy does not exist');
  }

  await caseStudyRepo.deleteCaseStudy(id);
};
