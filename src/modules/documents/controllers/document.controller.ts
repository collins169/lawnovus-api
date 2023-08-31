import { HttpStatus } from '@nestjs/common';
import { AuthenticatedRequest } from '../../../common/types';
import {
  getAllDocuments,
  getOneDocument,
  addDocument,
  updateDocument,
  deleteDocumentById,
} from '../services/document.service';
import { Response } from 'express';

export const getDocumentByIdCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const document = await getOneDocument(id);

  return res.status(HttpStatus.OK).json(document);
};

export const getDocumentsCtrl = async (_req: AuthenticatedRequest, res: Response) => {
  const document = await getAllDocuments();
  return res.status(HttpStatus.OK).json(document);
};

export const addDocumentCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    apiGateway: { event },
    user: { id },
  } = req;
  const result = await addDocument(event, id);

  return res.status(HttpStatus.OK).json(result);
};

export const updateDocumentCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const {
    apiGateway: { event },
    user: { id: updatedBy },
    params: { id },
    body,
  } = req;
  const result = await updateDocument({ id, data: { ...body, fileData: event }, updatedBy });

  return res.status(HttpStatus.OK).json(result);
};

export const deleteDocumentCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await deleteDocumentById(id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
