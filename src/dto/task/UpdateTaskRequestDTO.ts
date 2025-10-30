export class UpdateTaskRequestDTO {
  title: string;
  description?: string;
  priority: string;
  stateId: number;
  taskTypeId: number;
  dueDate: string;

  constructor(
    title: string,
    description: string,
    priority: string,
    stateId: number,
    taskTypeId: number,
    dueDate: string,
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.stateId = stateId;
    this.taskTypeId = taskTypeId;
    this.dueDate = dueDate;
  }
}
