import { Request, Response, NextFunction } from 'express';

import { TaskTypeDTO } from '../../dto/taskType/TaskTypeDTO';
import TaskTypeService from '../../services/TaskTypeService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const taskTypeService = new TaskTypeService();
  try {
    const taskType = await taskTypeService.show(id);
    res.customSuccess(200, 'TaskType found', new TaskTypeDTO(taskType));
  } catch (err) {
    return next(err);
  }
};
