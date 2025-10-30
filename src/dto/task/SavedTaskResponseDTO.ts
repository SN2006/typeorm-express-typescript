import { Task } from '../../orm/entities/tasks';

export class SavedTaskResponseDTO {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  userId: number;
  stateId: number;
  taskTypeId: number;
  dueDate: Date | null;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.priority = task.priority;
    this.userId = task.userId;
    this.stateId = task.stateId;
    this.taskTypeId = task.taskTypeId;
    this.dueDate = task.dueDate;
  }
}
