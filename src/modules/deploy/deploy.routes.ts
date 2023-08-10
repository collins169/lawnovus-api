import { celebrate, Joi, Segments } from 'celebrate';
import express from 'express';
import { runMigrations } from './controllers/migrations.controller';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';

export const MIGRATION_KEY_HEADER = 'x-deploy-migrations-key';

const router: express.Router = express.Router();

router.post(
  '/migrations',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      [MIGRATION_KEY_HEADER]: Joi.string().required(),
    }).unknown(),
  }),
  handleAsyncErrors(runMigrations),
);

export const deployMigrationRoute = router;
