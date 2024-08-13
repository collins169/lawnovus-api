import express from 'express';
import { categoryRoutes } from './categories/category.routes';
import { bookRoutes } from './books/books.routes';
import { articleRoutes } from './articles/articles.routes';
import { caseStudyRoutes } from './case-studies/case-studies.routes';
import { legislationRoutes } from './legislation/legislation.routes';
import { noticeRoutes } from './notices/notices.routes';
import { treatyRoutes } from './treaties/treaties.routes';

const router: express.Router = express.Router();
router.use('/articles', articleRoutes);
router.use('/case-studies', caseStudyRoutes);
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);
router.use('/legislation', legislationRoutes);
router.use('/notices', noticeRoutes);
router.use('/treaties', treatyRoutes);

export const catalogRoutes = router;
