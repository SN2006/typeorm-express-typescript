import { TaskType } from '../../orm/entities/taskTypes';

export class UpdateTaskTypeDTO {
  id: number;
  name: string;

  constructor(taskType: TaskType) {
    this.id = taskType.id;
    this.name = taskType.name;
  }
}
