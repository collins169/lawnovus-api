import { In } from 'typeorm';
import { getEntityRepository } from '../../../database/getEntityRepository';
import { Document } from '../entities/document.entity';

export const getDocumentRepository = async () => {
  return await getEntityRepository(Document);
};

export const getDocumentById = async (id: string) => {
  const repository = await getDocumentRepository();
  const result = await repository.findOne({
    where: {
      id,
    },
  });

  await repository.manager.connection.destroy();
  return result;
};

export const getDocumentsByIds = async (ids: Array<string>) => {
  const repository = await getDocumentRepository();
  const result = await repository.find({
    where: {
      id: In([...ids]),
    },
  });

  await repository.manager.connection.destroy();
  return result;
};

export const getDocuments = async () => {
  const repository = await getDocumentRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
  });
};

export const updateDocument = async ({ old, input }: { input: Partial<Document>; old: Document }) => {
  const repository = await getDocumentRepository();
  const typeToUpdate = repository.merge(old, input);
  return await repository.save(typeToUpdate);
};

export const deleteDocument = async (id: string) => {
  const repository = await getDocumentRepository();
  return await repository.delete(id);
};

export const createDocument = async (document: Omit<Document, 'id' | 'updatedBy' | 'updatedAt' | 'createdAt'>) => {
  const repository = await getDocumentRepository();
  const insert = repository.create({
    ...document,
  });
  return await repository.save(insert);
};
