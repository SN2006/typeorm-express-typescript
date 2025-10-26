import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Task } from 'orm/entities/tasks/Task';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;

  const taskRepository = getRepository(Task);
  try {
    const task = await taskRepository.findOne({ where: { id } });

    if (!task) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Task with id:${id} doesn't exist.`]);
      return next(customError);
    }

    if (task.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', ['You can only delete your own tasks.']);
      return next(customError);
    }

    await taskRepository.delete(id);

    res.customSuccess(200, 'Task successfully deleted.', { id: task.id, title: task.title });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
