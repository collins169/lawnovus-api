import { getEntityRepository } from '../../../../database/getEntityRepository';
import { Article } from '../entities/article';

export const getArticleRepository = async () => {
  return await getEntityRepository(Article);
};

export const saveArticle = async (input: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getArticleRepository();
  const articleToInsert = repository.create({ ...input });
  return await repository.save(articleToInsert);
};

export const getArticleById = async (id: string) => {
  const repository = await getArticleRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getArticleByType = async (type: string) => {
  const repository = await getArticleRepository();
  return await repository.findOne({
    where: {
      type: {
        id: type,
      },
    },
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getArticles = async () => {
  const repository = await getArticleRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const updateArticle = async ({ old, input }: { input: Partial<Article>; old: Article }) => {
  const repository = await getArticleRepository();
  const articleToUpdate = repository.merge(old, input);
  return await repository.save(articleToUpdate);
};

export const deleteArticle = async (id: string | string[]) => {
  const repository = await getArticleRepository();
  return await repository.softDelete(id);
};
