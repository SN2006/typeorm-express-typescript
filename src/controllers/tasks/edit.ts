import { Request, Response, NextFunction } from 'express';

import { SavedTaskResponseDTO } from '../../dto/task/SavedTaskResponseDTO';
import { UpdateTaskRequestDTO } from '../../dto/task/UpdateTaskRequestDTO';
import TaskService from '../../services/TaskService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { title, description, priority, stateId, taskTypeId, dueDate } = req.body;
  const currentUserId = req.jwtPayload.id;

  const taskService = new TaskService();
  try {
    const updateTaskRequestDTO = new UpdateTaskRequestDTO(title, description, priority, stateId, taskTypeId, dueDate);
    const savedTask = await taskService.update(id, currentUserId, updateTaskRequestDTO);
    res.customSuccess(200, 'Task successfully updated.', new SavedTaskResponseDTO(savedTask));
  } catch (err) {
    return next(err);
  }
};
