import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const listMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;
  const taskTypeRepository = getRepository(TaskType);

  try {
    const taskTypes = await taskTypeRepository.find({
      where: { userId },
      relations: ['user'],
      select: ['id', 'name', 'created_at', 'updated_at'],
    });
    res.customSuccess(200, 'List of your task types.', taskTypes);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of task types.`, null, err);
    return next(customError);
  }
};
