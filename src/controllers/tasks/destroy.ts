import { Request, Response, NextFunction } from 'express';

import TaskService from '../../services/TaskService';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;

  const taskService = new TaskService();
  try {
    const deletedTask = await taskService.delete(id, currentUserId);
    res.customSuccess(200, 'Task successfully deleted.', deletedTask);
  } catch (err) {
    return next(err);
  }
};
