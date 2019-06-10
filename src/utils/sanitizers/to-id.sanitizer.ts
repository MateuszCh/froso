import { sanitizeParam } from 'express-validator/filter';

export const toIdSanitizer = sanitizeParam('id').toInt(10);
