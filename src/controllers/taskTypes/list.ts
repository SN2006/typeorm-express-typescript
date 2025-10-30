import { Request, Response, NextFunction } from 'express';

import { TaskTypeDTO } from '../../dto/taskType/TaskTypeDTO';
import TaskTypeService from '../../services/TaskTypeService';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const taskTypeService = new TaskTypeService();
  try {
    const taskTypes = (await taskTypeService.list()).map((taskType) => new TaskTypeDTO(taskType));
    res.customSuccess(200, 'List of task types.', taskTypes);
  } catch (err) {
    return next(err);
  }
};
