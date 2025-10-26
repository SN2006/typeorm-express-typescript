import { Router } from 'express';

import { list, listMy, show, create, edit, destroy } from 'controllers/states';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreate, validatorEdit } from 'middleware/validation/states';

const router = Router();

router.get('/', [checkJwt], list);

router.get('/my', [checkJwt], listMy);

router.get('/:id([0-9]+)', [checkJwt], show);

router.post('/', [checkJwt, validatorCreate], create);

router.patch('/:id([0-9]+)', [checkJwt, validatorEdit], edit);

router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
