import { Router } from 'express';

import auth from './auth';
import states from './states';
import tasks from './tasks';
import taskTypes from './taskTypes';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/states', states);
router.use('/task-types', taskTypes);
router.use('/tasks', tasks);

export default router;
