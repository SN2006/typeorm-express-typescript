export class DeleteUserResponseDTO {
  id: number;
  name: string;
  email: string;

  constructor({ id, name, email }: { id: number; name: string; email: string }) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
