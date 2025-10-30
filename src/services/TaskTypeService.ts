import { getRepository, Repository } from 'typeorm';

import { TaskType } from 'orm/entities/taskTypes/TaskType';
import { CustomError } from 'utils/response/custom-error/CustomError';

class TaskTypeService {
  private taskTypeRepository: Repository<TaskType> = getRepository(TaskType);

  public async create(name: string, userId: number): Promise<TaskType> {
    try {
      const taskType = new TaskType();
      taskType.name = name;
      taskType.userId = userId;

      try {
        await this.taskTypeRepository.save(taskType);
        return taskType;
      } catch (err) {
        throw new CustomError(400, 'Raw', `TaskType can't be created.`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  public async list(): Promise<TaskType[]> {
    try {
      return await this.taskTypeRepository.find({
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of task types.`, null, err);
    }
  }

  public async listMy(userId: number): Promise<TaskType[]> {
    try {
      return await this.taskTypeRepository.find({
        where: { userId },
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of task types.`, null, err);
    }
  }

  public async show(id: string): Promise<TaskType> {
    try {
      const taskType = await this.taskTypeRepository.findOne(id, {
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });

      if (!taskType) {
        throw new CustomError(404, 'General', `TaskType with id:${id} not found.`, ['TaskType not found.']);
      }

      return taskType;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  public async edit(id: string, name: string, currentUserId: number): Promise<TaskType> {
    try {
      const taskType = await this.taskTypeRepository.findOne({ where: { id } });

      if (!taskType) {
        throw new CustomError(404, 'General', `TaskType with id:${id} not found.`, ['TaskType not found.']);
      }

      if (taskType.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only edit your own task types.']);
      }

      if (name) {
        taskType.name = name;
      }

      try {
        await this.taskTypeRepository.save(taskType);
        return taskType;
      } catch (err) {
        throw new CustomError(409, 'Raw', `TaskType can't be updated.`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  public async destroy(id: string, currentUserId: number): Promise<{ id: number; name: string }> {
    try {
      const taskType = await this.taskTypeRepository.findOne({ where: { id } });

      if (!taskType) {
        throw new CustomError(404, 'General', 'Not Found', [`TaskType with id:${id} doesn't exist.`]);
      }

      if (taskType.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only delete your own task types.']);
      }

      await this.taskTypeRepository.delete(id);

      return { id: taskType.id, name: taskType.name };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }
}

export default TaskTypeService;
