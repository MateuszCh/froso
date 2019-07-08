import { Router } from 'express';

import { postsRouter } from './posts.router';
import { postTypesRouter } from './postTypes.router';
import { usersRouter } from './users.router';

const router = Router();

router.use('/post', postsRouter.getRouter());
router.use('/postType', postTypesRouter.getRouter());
router.use('/user', usersRouter.getRouter());

export default router;
