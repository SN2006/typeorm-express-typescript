import { Request, Response, NextFunction } from 'express';

import { UpdateTaskTypeDTO } from '../../dto/taskType/UpdateTaskTypeDTO';
import TaskTypeService from '../../services/TaskTypeService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  const currentUserId = req.jwtPayload.id;

  const taskTypeService = new TaskTypeService();
  try {
    const updatedTaskType = await taskTypeService.edit(id, name, currentUserId);
    res.customSuccess(200, 'TaskType successfully updated.', new UpdateTaskTypeDTO(updatedTaskType));
  } catch (err) {
    return next(err);
  }
};
