import { NotFoundException } from '@nestjs/common';
import * as articleRepo from '../repositories/case-study.repository';
import { CaseStudy } from '../entities/case-studies';
import { CreateCaseStudyInput } from '../dto/create-case-study.input';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';

export const getAllCaseStudies = async () => {
  const articles = await articleRepo.getCaseStudies();
  const mappedCaseStudies = await Promise.all(
    articles.map(async (article) => {
      const [coverImageUrl, fileUrl] = await Promise.all([
        getS3Instant().getObjectPresignedUrl(article?.coverImage?.key, TEN_MINUTES),
        getS3Instant().getObjectPresignedUrl(article?.file?.key, TEN_MINUTES),
      ]);
      return {
        ...article,
        file: {
          ...article?.file,
          url: fileUrl,
        },
        coverImage: {
          ...article?.coverImage,
          url: coverImageUrl,
        },
      };
    }),
  );
  return mappedCaseStudies;
};

export const getOneCaseStudyById = async (id: string) => {
  const article: CaseStudy = await articleRepo.getCaseStudyById(id);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }
  const [coverImageUrl, fileUrl] = await Promise.all([
    getS3Instant().getObjectPresignedUrl(article?.coverImage?.key, TEN_MINUTES),
    getS3Instant().getObjectPresignedUrl(article?.file?.key, TEN_MINUTES),
  ]);
  return {
    ...article,
    file: {
      ...article?.file,
      url: fileUrl,
    },
    coverImage: {
      ...article?.coverImage,
      url: coverImageUrl,
    },
  };
};

export const createCaseStudy = async (
  { coverImage, file, type, ...input }: CreateCaseStudyInput,
  createdBy: string,
) => {
  const [coverImg, articleFile, category] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
  ]);
  const admin = await getAdministratorByUserId(createdBy);
  await articleRepo.saveCaseStudy({
    ...input,
    file: articleFile,
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
  const [coverImg, articleFile, category, article] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
    articleRepo.getCaseStudyById(id),
  ]);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await articleRepo.updateCaseStudy({
    old: article,
    input: {
      ...input,
      file: articleFile,
      type: category,
      coverImage: coverImg,
      updatedBy: admin,
    },
  });
};

export const deleteCaseStudy = async (id: string) => {
  const article: CaseStudy = await articleRepo.getCaseStudyById(id);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }

  await articleRepo.deleteCaseStudy(id);
};
