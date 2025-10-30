import { Request, Response, NextFunction } from 'express';

import { TaskDTO } from '../../dto/task/TaskDTO';
import TaskService from '../../services/TaskService';

export const listMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;
  const taskService = new TaskService();

  try {
    const tasks = (await taskService.getByUserId(userId)).map((task) => new TaskDTO(task));
    res.customSuccess(200, 'List of your tasks.', tasks);
  } catch (err) {
    return next(err);
  }
};
