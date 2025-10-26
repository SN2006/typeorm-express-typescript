import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  const currentUserId = req.jwtPayload.id;

  const taskTypeRepository = getRepository(TaskType);
  try {
    const taskType = await taskTypeRepository.findOne({ where: { id } });

    if (!taskType) {
      const customError = new CustomError(404, 'General', `TaskType with id:${id} not found.`, ['TaskType not found.']);
      return next(customError);
    }

    if (taskType.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', ['You can only edit your own task types.']);
      return next(customError);
    }

    if (name) {
      taskType.name = name;
    }

    try {
      await taskTypeRepository.save(taskType);
      res.customSuccess(200, 'TaskType successfully updated.', taskType);
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `TaskType can't be updated.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
