import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const userId = req.jwtPayload.id;

  const taskTypeRepository = getRepository(TaskType);

  try {
    const taskType = new TaskType();
    taskType.name = name;
    taskType.userId = userId;

    try {
      await taskTypeRepository.save(taskType);
      res.customSuccess(201, 'TaskType successfully created.', taskType);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `TaskType can't be created.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
