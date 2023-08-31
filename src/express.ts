import express from 'express';
import helmet from 'helmet';
import { requestLogger, specifyCors, errorHandler } from './common/middleware';
import { HttpStatus } from '@nestjs/common';
import { deployMigrationRoute } from './modules/deploy/deploy.routes';
import { authRoutes } from './modules/auth/auth.routes';
// import { userRoutes } from './modules/users/user.routes';
import { organizationTypeRoutes } from './modules/organizationType/organizationType.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { subscriberRoutes } from './modules/subscriber/subscriber.routes';
import { JWTTokenHandler } from './common/middleware/checkToken.middleware';
import { documentRoutes } from './modules/documents/document.routes';
import { catalogRoutes } from './modules/catalogs/catalog.routes';

export const expressAPI = (): express.Application => {
  const api = express();
  api.disable('x-powered-by');
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));
  api.use(helmet());
  api.use(requestLogger);
  api.use(specifyCors());
  api.all('/ping', (_, res) => res.sendStatus(HttpStatus.OK));
  api.use('/deploy', deployMigrationRoute);

  api.use('/auth', authRoutes);

  api.use(JWTTokenHandler);
  api.use('/admin', adminRoutes);
  api.use('/catalogs', catalogRoutes);
  // api.use('/users', userRoutes);
  api.use('/subscribers', subscriberRoutes);
  api.use('/documents', documentRoutes);
  api.use('/organization/types', organizationTypeRoutes);

  api.use(errorHandler);

  return api;
};
