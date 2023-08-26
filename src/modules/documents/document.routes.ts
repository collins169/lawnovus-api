import express from 'express';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import {
  addDocumentCtrl,
  deleteDocumentCtrl,
  getDocumentByIdCtrl,
  getDocumentsCtrl,
  updateDocumentCtrl,
} from './controllers/document.controller';

const router: express.Router = express.Router();

router.post('/', handleAsyncErrors(addDocumentCtrl));
router.get('/', handleAsyncErrors(getDocumentsCtrl));
router.get('/:id', handleAsyncErrors(getDocumentByIdCtrl));
router.patch('/:id', handleAsyncErrors(updateDocumentCtrl));
router.delete('/:id', handleAsyncErrors(deleteDocumentCtrl));

export const documentRoutes = router;
