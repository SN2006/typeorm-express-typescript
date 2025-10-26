import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  let { title } = req.body;
  const { priority, stateId, taskTypeId, dueDate } = req.body;
  const userId = req.jwtPayload.id;
  const errorsValidation: ErrorValidation[] = [];

  title = !title ? '' : title;

  if (!title.trim()) {
    errorsValidation.push({ title: 'Title is required' });
  }

  if (title.length > 200) {
    errorsValidation.push({ title: 'Title must be maximum 200 characters' });
  }

  if (!priority) {
    errorsValidation.push({ priority: 'Priority is required' });
  } else if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
    errorsValidation.push({ priority: 'Priority must be LOW, MEDIUM, or HIGH' });
  }

  if (!stateId) {
    errorsValidation.push({ stateId: 'State ID is required' });
  } else {
    try {
      const stateRepository = getRepository(State);
      const state = await stateRepository.findOne({ where: { id: stateId } });

      if (!state) {
        errorsValidation.push({ stateId: `State with id:${stateId} not found` });
      } else if (state.userId !== userId) {
        errorsValidation.push({ stateId: 'State must belong to you' });
      }
    } catch (err) {
      errorsValidation.push({ stateId: 'Invalid state ID' });
    }
  }

  if (!taskTypeId) {
    errorsValidation.push({ taskTypeId: 'Task Type ID is required' });
  } else {
    try {
      const taskTypeRepository = getRepository(TaskType);
      const taskType = await taskTypeRepository.findOne({ where: { id: taskTypeId } });

      if (!taskType) {
        errorsValidation.push({ taskTypeId: `TaskType with id:${taskTypeId} not found` });
      } else if (taskType.userId !== userId) {
        errorsValidation.push({ taskTypeId: 'TaskType must belong to you' });
      }
    } catch (err) {
      errorsValidation.push({ taskTypeId: 'Invalid task type ID' });
    }
  }

  if (!dueDate) {
    errorsValidation.push({ dueDate: 'Due date is required' });
  } else {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errorsValidation.push({ dueDate: 'Invalid date format' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create task validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
