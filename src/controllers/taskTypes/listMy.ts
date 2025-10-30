import { Request, Response, NextFunction } from 'express';

import { TaskTypeDTO } from '../../dto/taskType/TaskTypeDTO';
import TaskTypeService from '../../services/TaskTypeService';

export const listMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;
  const taskTypeService = new TaskTypeService();

  try {
    const taskTypes = (await taskTypeService.listMy(userId)).map((taskType) => new TaskTypeDTO(taskType));
    res.customSuccess(200, 'List of your task types.', taskTypes);
  } catch (err) {
    return next(err);
  }
};
