import { Request, Response, NextFunction } from 'express';

import { CreateTaskRequestDTO } from '../../dto/task/CreateTaskRequestDTO';
import { SavedTaskResponseDTO } from '../../dto/task/SavedTaskResponseDTO';
import TaskService from '../../services/TaskService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority, stateId, taskTypeId, dueDate } = req.body;
  const userId = req.jwtPayload.id;

  const taskService = new TaskService();

  try {
    const createTaskRequestDTO = new CreateTaskRequestDTO(
      title,
      description,
      priority,
      userId,
      stateId,
      taskTypeId,
      dueDate,
    );
    const savedTask = await taskService.create(createTaskRequestDTO);

    res.customSuccess(201, 'Task successfully created.', new SavedTaskResponseDTO(savedTask));
  } catch (err) {
    return next(err);
  }
};
