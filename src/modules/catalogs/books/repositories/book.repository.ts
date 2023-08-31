import { getEntityRepository } from '../../../../database/getEntityRepository';
import { Book } from '../entities/book';

export const getBookRepository = async () => {
  return await getEntityRepository(Book);
};

export const saveBook = async (input: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getBookRepository();
  const bookToInsert = repository.create({ ...input });
  return await repository.save(bookToInsert);
};

export const getBookById = async (id: string) => {
  const repository = await getBookRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getBookByType = async (type: string) => {
  const repository = await getBookRepository();
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

export const getBooks = async () => {
  const repository = await getBookRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const updateBook = async ({ old, input }: { input: Partial<Book>; old: Book }) => {
  const repository = await getBookRepository();
  const bookToUpdate = repository.merge(old, input);
  return await repository.save(bookToUpdate);
};

export const deleteBook = async (id: string | string[]) => {
  const repository = await getBookRepository();
  return await repository.softDelete(id);
};
