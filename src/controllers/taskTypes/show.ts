import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const taskTypeRepository = getRepository(TaskType);
  try {
    const taskType = await taskTypeRepository.findOne(id, {
      relations: ['user'],
      select: ['id', 'name', 'created_at', 'updated_at'],
    });

    if (!taskType) {
      const customError = new CustomError(404, 'General', `TaskType with id:${id} not found.`, ['TaskType not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'TaskType found', taskType);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
