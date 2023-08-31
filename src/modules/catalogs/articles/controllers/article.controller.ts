import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import { createArticle, getAllArticles, getOneArticleById, updateArticle } from '../services/article.service';
import { HttpStatus } from '@nestjs/common';
import { CreateArticleInput } from '../dto/create-article.input';
import { deleteArticle } from '../repositories/article.repository';

export const getAllArticlesCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const articles = await getAllArticles();
  return res.status(HttpStatus.OK).json(articles);
};

export const getOneArticleCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const article = await getOneArticleById(id);
  return res.status(HttpStatus.OK).json(article);
};

export const createArticleCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateArticleInput;

  await createArticle(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateArticleCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateArticleInput;

  await updateArticle(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteArticleCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteArticle(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
