import { NotFoundException } from '@nestjs/common';
import * as bookRepo from '../repositories/book.repository';
import { Book } from '../entities/book.entity';
import { CreateBookInput } from '../dto/create-book.input';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';

export const getAllBooks = async () => {
  const books = await bookRepo.getBooks();
  const mappedBooks = await Promise.all(
    books.map(async (book) => {
      const [coverImageUrl, fileUrl] = await Promise.all([
        getS3Instant().getObjectPresignedUrl(book?.coverImage?.key, TEN_MINUTES),
        getS3Instant().getObjectPresignedUrl(book?.file?.key, TEN_MINUTES),
      ]);
      return {
        ...book,
        file: {
          ...book?.file,
          url: fileUrl,
        },
        coverImage: {
          ...book?.coverImage,
          url: coverImageUrl,
        },
      };
    }),
  );
  return mappedBooks;
};

export const getOneBookById = async (id: string) => {
  const book: Book = await bookRepo.getBookById(id);
  if (!book) {
    throw new NotFoundException('this book does not exist');
  }
  const [coverImageUrl, fileUrl] = await Promise.all([
    getS3Instant().getObjectPresignedUrl(book?.coverImage?.key, TEN_MINUTES),
    getS3Instant().getObjectPresignedUrl(book?.file?.key, TEN_MINUTES),
  ]);
  return {
    ...book,
    file: {
      ...book?.file,
      url: fileUrl,
    },
    coverImage: {
      ...book?.coverImage,
      url: coverImageUrl,
    },
  };
};

export const createBook = async ({ coverImage, file, type, ...input }: CreateBookInput, createdBy: string) => {
  const [coverImg, bookFile, category] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
  ]);
  const admin = await getAdministratorByUserId(createdBy);
  await bookRepo.saveBook({
    ...input,
    file: bookFile,
    type: category,
    coverImage: coverImg,
    createdBy: admin,
  });
};

export const updateBook = async (
  id: string,
  { coverImage, file, type, ...input }: Partial<CreateBookInput>,
  updatedBy: string,
) => {
  const [coverImg, bookFile, category, book] = await Promise.all([
    getOneDocument(coverImage),
    getOneDocument(file),
    getOneCategoryById(type),
    bookRepo.getBookById(id),
  ]);
  if (!book) {
    throw new NotFoundException('this book does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await bookRepo.updateBook({
    old: book,
    input: {
      ...input,
      file: bookFile,
      type: category,
      coverImage: coverImg,
      updatedBy: admin,
    },
  });
};

export const deleteBook = async (id: string) => {
  const book: Book = await bookRepo.getBookById(id);
  if (!book) {
    throw new NotFoundException('this book does not exist');
  }

  await bookRepo.deleteBook(id);
};
