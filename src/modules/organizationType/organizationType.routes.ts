import express from 'express';
import { validateBody } from '../../common/validators/validateBody';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { OrganizationTypeInput } from './dto/organizationType.input';
import {
  addOrganizationTypeCtrl,
  deleteOrganizationTypeCtrl,
  editOrganizationTypeCtrl,
  getOrganizationTypeByIdCtrl,
  getOrganizationTypesCtrl,
  changeOrganizationTypeStatusCtrl,
} from './controllers/organizationType.controller';

const router: express.Router = express.Router();

router.post('/', validateBody(OrganizationTypeInput), handleAsyncErrors(addOrganizationTypeCtrl));
router.get('/', handleAsyncErrors(getOrganizationTypesCtrl));
router.get('/:id', handleAsyncErrors(getOrganizationTypeByIdCtrl));
router.patch('/:id', validateBody(OrganizationTypeInput), handleAsyncErrors(editOrganizationTypeCtrl));
router.patch('/:id/:status', handleAsyncErrors(changeOrganizationTypeStatusCtrl));
router.delete('/:id', handleAsyncErrors(deleteOrganizationTypeCtrl));

export const organizationTypeRoutes = router;
