import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as docRepo from '../repositories/document.repository';
import { S3Service } from '../../../common/service/s3.service';
import { TEN_MINUTES } from '../../../common/constants/timeUnits';
import { Document } from '../entities/document.entity';
import { MultipartRequest, parse as multipartParser } from 'lambda-multipart-parser';
import { APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import mimeType from 'mime-types';
import { getAdministratorByUserId } from '../../admin/repositories/administrator.repository';
import { AddDocumentResult } from '../types';
import { logger } from '../../../common/helpers/logger';
import { formatFileSize } from '../../../common/helpers/document.helper';

const s3 = new S3Service(process.env.DOCUMENT_BUCKET_NAME);

export const getOneDocument = async (id: string) => {
  const document = await docRepo.getDocumentById(id);
  if (!document) {
    throw new NotFoundException(`document with id: ${id} is not found`);
  }
  const url = await s3.getObjectPresignedUrl(document.key, TEN_MINUTES);
  return {
    ...document,
    url,
  };
};

export const getAllDocuments = async (): Promise<Array<{ url: string } & Document>> => {
  const documents = await docRepo.getDocuments();
  const mappedDocuments = await Promise.all(
    documents.map(async ({ key, ...rest }) => {
      const url = await s3.getObjectPresignedUrl(key, TEN_MINUTES);
      return {
        ...rest,
        key,
        url,
      };
    }),
  );
  return mappedDocuments;
};

export const deleteDocumentById = async (id: string): Promise<void> => {
  const document = await docRepo.getDocumentById(id);
  if (!document) {
    throw new NotFoundException(`document with id: ${id} is not found`);
  }
  await docRepo.deleteDocument(id);
  await s3.deleteFile(document.key);
};

export const updateDocument = async ({
  id,
  data,
  updatedBy,
}: {
  id: string;
  data: Partial<Document> & { fileData: APIGatewayEvent };
  updatedBy: string;
}) => {
  const { files, ...multipart }: MultipartRequest = await multipartParser(data.fileData);

  if (!files || files.length === 0) {
    throw new BadRequestException('No file was sent');
  }

  const document = await docRepo.getDocumentById(id);
  if (!document) {
    throw new NotFoundException(`document with id: ${id} is not found`);
  }

  const admin = await getAdministratorByUserId(updatedBy);

  const [file] = files;
  const { content, ...rest } = file;
  const ext = rest?.filename.split('.').pop();
  const newFileName = `${multipart?.catalog || 'document'}/${uuid()}.${ext}`;
  const key = `${process.env.STAGE}/${newFileName}`;
  const type = mimeType.extension(rest?.contentType) || '';
  const size = formatFileSize(content.length);
  await Promise.all([
    docRepo.updateDocument({
      old: document,
      input: {
        ...data,
        key,
        name: newFileName,
        fileType: type,
        mimeType: rest?.contentType,
        size,
        updatedBy: admin,
        metaData: { ...rest, ...multipart },
      },
    }),
    s3.deleteFile(document.key),
    s3.uploadFile(content, data.key),
  ]);
  return {
    id: document?.id,
    key,
    type,
    size,
    contentType: rest?.contentType,
    filename: newFileName,
  };
};

export const addDocument = async (data: APIGatewayEvent, createdBy: string): Promise<Array<AddDocumentResult>> => {
  const { files, ...multipart }: MultipartRequest = await multipartParser(data);

  if (!files || files.length === 0) {
    throw new BadRequestException('No file was sent');
  }

  const admin = await getAdministratorByUserId(createdBy);
  const result = await Promise.all(
    files?.map(async ({ content, ...rest }) => {
      const { contentType, filename } = rest;
      const ext = filename.split('.').pop();
      const newFileName = `${multipart?.catalog || 'document'}/${uuid()}.${ext}`;
      const key = `${process.env.STAGE}/${newFileName}`;
      const type = mimeType.extension(contentType) || '';
      const size = formatFileSize(content.length);
      await s3.uploadFile(content, key);
      const document = await docRepo.createDocument({
        key,
        name: newFileName,
        fileType: type,
        mimeType: contentType,
        size,
        createdBy: admin,
        metaData: { ...rest, ...multipart },
      });

      return {
        id: document?.id,
        key,
        type,
        size,
        contentType,
        filename: newFileName,
        url: await s3.getObjectPresignedUrl(key, TEN_MINUTES),
      };
    }),
  );
  return result;
};
