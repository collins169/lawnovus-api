import { Request, Response } from 'express';
import { search } from '../services/search.service';
import { HttpStatus } from '@nestjs/common';

export const searchCatalogCtrl = async (req: Request, res: Response) => {
  const { q } = req.query;
  const result = await search(q as string);
  return res.status(HttpStatus.OK).json(result);
};
