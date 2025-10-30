import { User } from '../../orm/entities/users';

export class ListedUserDTO {
  id: number;
  email: string;
  username: string;
  name: string;
  role: string;
  language: string;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.name = user.name;
    this.role = user.role;
    this.language = user.language;
  }
}
