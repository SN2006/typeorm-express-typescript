import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;

  const taskTypeRepository = getRepository(TaskType);
  try {
    const taskType = await taskTypeRepository.findOne({ where: { id } });

    if (!taskType) {
      const customError = new CustomError(404, 'General', 'Not Found', [`TaskType with id:${id} doesn't exist.`]);
      return next(customError);
    }

    if (taskType.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', [
        'You can only delete your own task types.',
      ]);
      return next(customError);
    }

    await taskTypeRepository.delete(id);

    res.customSuccess(200, 'TaskType successfully deleted.', { id: taskType.id, name: taskType.name });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
