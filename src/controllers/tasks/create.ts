import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Task } from 'orm/entities/tasks/Task';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority, stateId, taskTypeId, dueDate } = req.body;
  const userId = req.jwtPayload.id;

  const taskRepository = getRepository(Task);

  try {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.userId = userId;
    task.stateId = stateId;
    task.taskTypeId = taskTypeId;
    task.dueDate = new Date(dueDate);

    try {
      await taskRepository.save(task);
      res.customSuccess(201, 'Task successfully created.', task);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Task can't be created.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
