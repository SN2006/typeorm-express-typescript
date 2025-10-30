import { TaskType } from '../../orm/entities/taskTypes';

export class TaskTypeDTO {
  id: number;
  name: string;
  owner: object;

  constructor(taskType: TaskType) {
    this.id = taskType.id;
    this.name = taskType.name;
    this.owner = {
      id: taskType.user.id,
      name: taskType.user.name,
      email: taskType.user.email,
    };
  }
}
