import { Router } from 'express';

import componentsRouter from './components.router';
import filesRouter from './files.router';
import pagesRouter from './pages.router';
import postsRouter from './posts.router';
import postTypesRouter from './postTypes.router';

const router = Router();

router.use('/page', pagesRouter);
router.use('/post', postsRouter);
router.use('/component', componentsRouter);
router.use('/file', filesRouter);
router.use('/postType', postTypesRouter);

export default router;
