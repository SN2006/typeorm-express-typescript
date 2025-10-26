import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Task } from 'orm/entities/tasks/Task';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { title, description, priority, stateId, taskTypeId, dueDate } = req.body;
  const currentUserId = req.jwtPayload.id;

  const taskRepository = getRepository(Task);
  try {
    const task = await taskRepository.findOne({ where: { id } });

    if (!task) {
      const customError = new CustomError(404, 'General', `Task with id:${id} not found.`, ['Task not found.']);
      return next(customError);
    }

    if (task.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', ['You can only edit your own tasks.']);
      return next(customError);
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (stateId !== undefined) task.stateId = stateId;
    if (taskTypeId !== undefined) task.taskTypeId = taskTypeId;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    try {
      await taskRepository.save(task);
      res.customSuccess(200, 'Task successfully updated.', task);
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Task can't be updated.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
