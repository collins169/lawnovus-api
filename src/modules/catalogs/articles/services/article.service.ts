import { NotFoundException } from '@nestjs/common';
import * as articleRepo from '../repositories/article.repository';
import { Article } from '../entities/article';
import { CreateArticleInput } from '../dto/create-article.input';
import { getOneDocument } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { S3Service } from '../../../../common/service/s3.service';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';
const s3 = new S3Service(process.env.DOCUMENT_BUCKET_NAME);

export const getAllArticles = async () => {
  const articles = await articleRepo.getArticles();
  const mappedArticles = await Promise.all(
    articles.map(async (article) => {
      const [coverImageUrl, fileUrl] = await Promise.all([
        s3.getObjectPresignedUrl(article?.coverImage?.key, TEN_MINUTES),
        s3.getObjectPresignedUrl(article?.file?.key, TEN_MINUTES),
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
  return mappedArticles;
};

export const getOneArticleById = async (id: string) => {
  const article: Article = await articleRepo.getArticleById(id);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }
  const [coverImageUrl, fileUrl] = await Promise.all([
    s3.getObjectPresignedUrl(article?.coverImage?.key, TEN_MINUTES),
    s3.getObjectPresignedUrl(article?.file?.key, TEN_MINUTES),
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

export const createArticle = async ({ coverImage, file, type, ...input }: CreateArticleInput, createdBy: string) => {
  const [coverImg, articleFile, category] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
  ]);
  const admin = await getAdministratorByUserId(createdBy);
  await articleRepo.saveArticle({
    ...input,
    file: articleFile,
    type: category,
    coverImage: coverImg,
    createdBy: admin,
  });
};

export const updateArticle = async (
  id: string,
  { coverImage, file, type, ...input }: Partial<CreateArticleInput>,
  updatedBy: string,
) => {
  const [coverImg, articleFile, category, article] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
    articleRepo.getArticleById(id),
  ]);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await articleRepo.updateArticle({
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

export const deleteArticle = async (id: string) => {
  const article: Article = await articleRepo.getArticleById(id);
  if (!article) {
    throw new NotFoundException('this article does not exist');
  }

  await articleRepo.deleteArticle(id);
};
