import { Router } from 'express';

import postsRouter from './posts.router';
import postTypesRouter from './postTypes.router';

const router = Router();

router.use('/post', postsRouter);
router.use('/postType', postTypesRouter);

export default router;
