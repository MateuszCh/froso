import { Router } from 'express';

import filesRouter from './files.router';
import postsRouter from './posts.router';
import postTypesRouter from './postTypes.router';

const router = Router();

router.use('/post', postsRouter);
router.use('/file', filesRouter);
router.use('/postType', postTypesRouter);

export default router;
