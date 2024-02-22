import { NotFoundException } from '@nestjs/common';
import * as noticeRepo from '../repositories/notices.repository';
import { Notice } from '../entities/notices.entity';
import { CreateNoticeInput } from '../dto/create-notice.input';
import { getOneDocument, getS3Instant } from '../../../documents/services/document.service';
import { getOneCategoryById } from '../../categories/services/category.service';
import { getAdministratorByUserId } from '../../../admin/repositories/administrator.repository';
import { TEN_MINUTES } from '../../../../common/constants/timeUnits';

export const getAllNotices = async () => {
  const notices = await noticeRepo.getNotices();
  const mappedNotices = await Promise.all(
    notices.map(async (notice) => {
      const fileUrl = await getS3Instant().getObjectPresignedUrl(notice?.file?.key, TEN_MINUTES);
      return {
        ...notice,
        file: {
          ...notice?.file,
          url: fileUrl,
        },
      };
    }),
  );
  return mappedNotices;
};

export const getOneNoticeById = async (id: string) => {
  const notice: Notice = await noticeRepo.getNoticeById(id);
  if (!notice) {
    throw new NotFoundException('this notice does not exist');
  }
  const fileUrl = await getS3Instant().getObjectPresignedUrl(notice?.file?.key, TEN_MINUTES);
  return {
    ...notice,
    file: {
      ...notice?.file,
      url: fileUrl,
    },
  };
};

export const createNotice = async ({ file, type, ...input }: CreateNoticeInput, createdBy: string) => {
  const [noticeFile, category] = await Promise.all([getOneDocument(file), getOneCategoryById(type)]);
  const admin = await getAdministratorByUserId(createdBy);
  await noticeRepo.saveNotice({
    ...input,
    file: noticeFile,
    type: category,
    createdBy: admin,
  });
};

export const updateNotice = async (
  id: string,
  { file, type, ...input }: Partial<CreateNoticeInput>,
  updatedBy: string,
) => {
  const [noticeFile, category, notice] = await Promise.all([
    getOneDocument(file),
    getOneCategoryById(type),
    noticeRepo.getNoticeById(id),
  ]);
  if (!notice) {
    throw new NotFoundException('this notice does not exist');
  }
  const admin = await getAdministratorByUserId(updatedBy);
  await noticeRepo.updateNotice({
    old: notice,
    input: {
      ...input,
      file: noticeFile,
      type: category,
      updatedBy: admin,
    },
  });
};

export const deleteNotice = async (id: string) => {
  const notice: Notice = await noticeRepo.getNoticeById(id);
  if (!notice) {
    throw new NotFoundException('this notice does not exist');
  }

  await noticeRepo.deleteNotice(id);
};
