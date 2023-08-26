import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../common/types';
import { createBook, getAllBooks, getOneBookById, updateBook } from '../services/book.service';
import { HttpStatus } from '@nestjs/common';
import { CreateBookInput } from '../dto/create-book.input';
import { deleteBook } from '../repositories/book.repository';

export const getAllBooksCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const books = await getAllBooks();
  return res.status(HttpStatus.OK).json(books);
};

export const getOneBookCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const book = await getOneBookById(id);
  return res.status(HttpStatus.OK).json(book);
};

export const createBookCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user;
  const input = req.body as CreateBookInput;

  await createBook(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const updateBookCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
    user: { id: updatedBy },
  } = req;
  const input = req.body as CreateBookInput;

  await updateBook(id, input, updatedBy);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deleteBookCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    params: { id },
  } = req;

  await deleteBook(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
