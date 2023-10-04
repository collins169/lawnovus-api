import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { MIGRATION_KEY } from '../../../common/constants/ssmKeys.constants';
import { MIGRATION_KEY_HEADER } from '../deploy.routes';
import SSMService from '../../../common/service/ssm.service';
import { connectTolawnovusDB } from '../../../database/manageConnections';
import { logger } from '../../../common/helpers/logger';

export const runMigrations = async (req: Request, res: Response) => {
  const migrationKey = req.headers[MIGRATION_KEY_HEADER];

  const ssmService = new SSMService();
  const ssmMigrationParamValue = await ssmService.getParameter(MIGRATION_KEY);

  if (ssmMigrationParamValue !== migrationKey) {
    throw new BadRequestException('Invalid migration key');
  }

  const dataSource: DataSource = await connectTolawnovusDB();

  await dataSource.runMigrations({ transaction: 'all' });

  try {
    // reset the migration key for security reasons
    await ssmService.setParameter(MIGRATION_KEY, uuidv4());
    await dataSource.destroy();
  } catch (e) {
    logger.error(e);
  }

  res.sendStatus(HttpStatus.OK);
};
