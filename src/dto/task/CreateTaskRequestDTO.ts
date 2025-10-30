export class CreateTaskRequestDTO {
  title: string;
  description?: string;
  priority: string;
  userId: number;
  stateId: number;
  taskTypeId: number;
  dueDate: string;

  constructor(
    title: string,
    description: string,
    priority: string,
    userId: number,
    stateId: number,
    taskTypeId: number,
    dueDate: string,
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.userId = userId;
    this.stateId = stateId;
    this.taskTypeId = taskTypeId;
    this.dueDate = dueDate;
  }
}
