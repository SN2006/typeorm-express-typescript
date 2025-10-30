import { Request, Response, NextFunction } from 'express';

import { TaskDTO } from '../../dto/task/TaskDTO';
import TaskService from '../../services/TaskService';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const taskService = new TaskService();
  try {
    const tasks = (await taskService.getAll()).map((task) => new TaskDTO(task));
    res.customSuccess(200, 'List of tasks.', tasks);
  } catch (err) {
    return next(err);
  }
};
