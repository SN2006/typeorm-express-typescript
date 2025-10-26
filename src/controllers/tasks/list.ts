import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Task } from 'orm/entities/tasks/Task';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const taskRepository = getRepository(Task);
  try {
    const tasks = await taskRepository.find({
      relations: ['user', 'state', 'taskType'],
      select: ['id', 'title', 'description', 'priority', 'dueDate', 'created_at', 'updated_at'],
    });
    res.customSuccess(200, 'List of tasks.', tasks);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of tasks.`, null, err);
    return next(customError);
  }
};
