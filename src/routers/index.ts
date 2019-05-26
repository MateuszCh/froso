import { Router } from 'express';

import filesRouter from './files.router';
import pagesRouter from './pages.router';
import postsRouter from './posts.router';
import postTypesRouter from './postTypes.router';

const router = Router();

router.use('/post', postsRouter);
router.use('/file', filesRouter);
router.use('/postType', postTypesRouter);
router.use('/page', pagesRouter);

export default router;
