import { Task } from '../../orm/entities/tasks';

export class TaskDTO {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
  owner: object;
  state: object;
  taskType: object;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.priority = task.priority;
    this.dueDate = task.dueDate;
    this.owner = {
      id: task.user.id,
      name: task.user.name,
      email: task.user.email,
    };
    this.state = {
      id: task.state.id,
      name: task.state.name,
    };
    this.taskType = {
      id: task.taskType.id,
      name: task.taskType.name,
    };
  }
}
