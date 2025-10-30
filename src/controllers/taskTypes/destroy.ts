import { Request, Response, NextFunction } from 'express';

import TaskTypeService from '../../services/TaskTypeService';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;

  const taskTypeService = new TaskTypeService();
  try {
    const taskTypeInfo = await taskTypeService.destroy(id, currentUserId);
    res.customSuccess(200, 'TaskType successfully deleted.', taskTypeInfo);
  } catch (err) {
    return next(err);
  }
};
