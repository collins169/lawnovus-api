import express from 'express';
import { searchCatalogCtrl } from './controllers/search.controller';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';

const router: express.Router = express.Router();
router.use('/catalogs', handleAsyncErrors(searchCatalogCtrl));

export const searchRoutes = router;
