import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createNoticeCtrl,
  deleteNoticeCtrl,
  getAllNoticesCtrl,
  getOneNoticeCtrl,
  updateNoticeCtrl,
} from './controllers/notice.controller';
import { CreateNoticeInput } from './dto/create-notice.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllNoticesCtrl));
router.get('/:id', handleAsyncErrors(getOneNoticeCtrl));
router.post('/', validateBody(CreateNoticeInput), handleAsyncErrors(createNoticeCtrl));
router.patch('/:id', validateBody(CreateNoticeInput), handleAsyncErrors(updateNoticeCtrl));
router.delete('/:id', handleAsyncErrors(deleteNoticeCtrl));

export const noticeRoutes = router;
