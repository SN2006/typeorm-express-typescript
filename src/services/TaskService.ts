import { getRepository, Repository } from 'typeorm';

import { CreateTaskRequestDTO } from '../dto/task/CreateTaskRequestDTO';
import { UpdateTaskRequestDTO } from '../dto/task/UpdateTaskRequestDTO';
import { Task } from '../orm/entities/tasks';
import { CustomError } from '../utils/response/custom-error/CustomError';

class TaskService {
  private taskRepository: Repository<Task> = getRepository(Task);

  public async create(data: CreateTaskRequestDTO): Promise<Task> {
    const task = new Task();
    task.title = data.title;
    task.description = data.description;
    task.priority = data.priority;
    task.userId = data.userId;
    task.stateId = data.stateId;
    task.taskTypeId = data.taskTypeId;

    if (data.dueDate) {
      task.dueDate = new Date(data.dueDate);
    }

    try {
      return await this.taskRepository.save(task);
    } catch (err) {
      throw new CustomError(400, 'Raw', `Task can't be created.`, null, err);
    }
  }

  public async getAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        relations: ['user', 'state', 'taskType'],
        select: ['id', 'title', 'description', 'priority', 'dueDate', 'created_at', 'updated_at'],
      });
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of tasks.`, null, err);
    }
  }

  public async getByUserId(userId: number): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        where: { userId },
        relations: ['user', 'state', 'taskType'],
        select: ['id', 'title', 'description', 'priority', 'dueDate', 'created_at', 'updated_at'],
      });
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of tasks.`, null, err);
    }
  }

  public async getById(id: string | number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne(id, {
        relations: ['user', 'state', 'taskType'],
        select: ['id', 'title', 'description', 'priority', 'dueDate', 'created_at', 'updated_at'],
      });

      if (!task) {
        throw new CustomError(404, 'General', `Task with id:${id} not found.`, ['Task not found.']);
      }

      return task;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  public async update(id: string | number, currentUserId: number, data: UpdateTaskRequestDTO): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        throw new CustomError(404, 'General', `Task with id:${id} not found.`, ['Task not found.']);
      }

      if (task.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only edit your own tasks.']);
      }

      if (data.title) task.title = data.title;
      if (data.description !== undefined) task.description = data.description;
      if (data.priority) task.priority = data.priority;
      if (data.stateId !== undefined) task.stateId = data.stateId;
      if (data.taskTypeId !== undefined) task.taskTypeId = data.taskTypeId;
      if (data.dueDate !== undefined) {
        task.dueDate = data.dueDate ? new Date(data.dueDate) : null;
      }

      try {
        return await this.taskRepository.save(task);
      } catch (err) {
        throw new CustomError(409, 'Raw', `Task can't be updated.`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  public async delete(id: string | number, currentUserId: number): Promise<{ id: number; title: string }> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        throw new CustomError(404, 'General', 'Not Found', [`Task with id:${id} doesn't exist.`]);
      }

      if (task.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only delete your own tasks.']);
      }

      const result = { id: task.id, title: task.title };
      await this.taskRepository.delete(id);

      return result;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }
}

export default TaskService;
