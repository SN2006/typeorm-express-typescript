import { User } from '../../orm/entities/users';

export class UserDTO {
  id: number;
  email: string;
  username: string;
  name: string;
  role: string;
  language: string;
  tasks: object;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.name = user.name;
    this.role = user.role;
    this.language = user.language;
    this.tasks = user.tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      };
    });
  }
}
