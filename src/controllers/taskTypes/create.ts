import { Request, Response, NextFunction } from 'express';

import { UpdateTaskTypeDTO } from '../../dto/taskType/UpdateTaskTypeDTO';
import TaskTypeService from '../../services/TaskTypeService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const userId = req.jwtPayload.id;

  const taskTypeService = new TaskTypeService();

  try {
    const createdTaskType = await taskTypeService.create(name, userId);
    res.customSuccess(201, 'TaskType successfully created.', new UpdateTaskTypeDTO(createdTaskType));
  } catch (err) {
    return next(err);
  }
};
