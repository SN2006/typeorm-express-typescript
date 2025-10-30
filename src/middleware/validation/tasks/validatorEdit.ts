import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

import StateService from '../../../services/StateService';
import TaskTypeService from '../../../services/TaskTypeService';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { title, priority, stateId, taskTypeId, dueDate } = req.body;
  const userId = req.jwtPayload.id;
  const errorsValidation: ErrorValidation[] = [];

  if (title !== undefined && !title.trim()) {
    errorsValidation.push({ title: 'Title cannot be empty' });
  }

  if (title && title.length > 200) {
    errorsValidation.push({ title: 'Title must be maximum 200 characters' });
  }

  if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
    errorsValidation.push({ priority: 'Priority must be LOW, MEDIUM, or HIGH' });
  }

  if (stateId !== undefined) {
    try {
      const stateService = new StateService();
      const state = await stateService.getStateById(stateId);

      if (!state) {
        errorsValidation.push({ stateId: `State with id:${stateId} not found` });
      } else if (state.userId !== userId) {
        errorsValidation.push({ stateId: 'State must belong to you' });
      }
    } catch (err) {
      errorsValidation.push({ stateId: 'Invalid state ID' });
    }
  }

  if (taskTypeId !== undefined) {
    try {
      const taskTypeService = new TaskTypeService();
      const taskType = await taskTypeService.show(taskTypeId);

      if (!taskType) {
        errorsValidation.push({ taskTypeId: `TaskType with id:${taskTypeId} not found` });
      } else if (taskType.userId !== userId) {
        errorsValidation.push({ taskTypeId: 'TaskType must belong to you' });
      }
    } catch (err) {
      errorsValidation.push({ taskTypeId: 'Invalid task type ID' });
    }
  }

  if (dueDate !== undefined) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errorsValidation.push({ dueDate: 'Invalid date format' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit task validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
