import { Request, Response, NextFunction } from 'express';

import { TaskDTO } from '../../dto/task/TaskDTO';
import TaskService from '../../services/TaskService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const taskService = new TaskService();
  try {
    const task = await taskService.getById(id);
    res.customSuccess(200, 'Task found', new TaskDTO(task));
  } catch (err) {
    return next(err);
  }
};
