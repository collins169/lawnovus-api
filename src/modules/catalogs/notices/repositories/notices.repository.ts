import { getEntityRepository } from '../../../../database/getEntityRepository';
import { Notice } from '../entities/notices.entity';

export const getNoticeRepository = async () => {
  return await getEntityRepository(Notice);
};

export const saveNotice = async (input: Omit<Notice, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getNoticeRepository();
  const noticeToInsert = repository.create({ ...input });
  return await repository.save(noticeToInsert);
};

export const getNoticeById = async (id: string) => {
  const repository = await getNoticeRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'type'],
  });
};

export const getNoticeByType = async (type: string) => {
  const repository = await getNoticeRepository();
  return await repository.findOne({
    where: {
      type: {
        id: type,
      },
    },
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'type'],
  });
};

export const getNotices = async () => {
  const repository = await getNoticeRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'type'],
  });
};

export const updateNotice = async ({ old, input }: { input: Partial<Notice>; old: Notice }) => {
  const repository = await getNoticeRepository();
  const noticeToUpdate = repository.merge(old, input);
  return await repository.save(noticeToUpdate);
};

export const deleteNotice = async (id: string | string[]) => {
  const repository = await getNoticeRepository();
  return await repository.softDelete(id);
};
