import express from 'express';
import { categoryRoutes } from './categories/category.routes';
import { bookRoutes } from './books/books.routes';
import { articleRoutes } from './articles/articles.routes';
import { caseStudyRoutes } from './case-studies/case-studies.routes';

const router: express.Router = express.Router();
router.use('/articles', articleRoutes);
router.use('/case-studies', caseStudyRoutes);
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);

export const catalogRoutes = router;
