import { getRepository, Repository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

class UserService {
  private userRepository: Repository<User> = getRepository(User);

  private readonly safeSelect: (keyof User)[] = [
    'id',
    'username',
    'name',
    'email',
    'role',
    'language',
    'created_at',
    'updated_at',
  ];

  private sanitize(user: User | undefined): Partial<User> | undefined {
    if (!user) return undefined;
    const { password, ...rest } = user as any;
    return rest;
  }

  async list(): Promise<Partial<User>[]> {
    try {
      const users = await this.userRepository.find({ select: this.safeSelect });
      return users.map((u) => this.sanitize(u)!);
    } catch (err) {
      throw new CustomError(400, 'Raw', "Can't retrieve list of users.", null, err);
    }
  }

  async show(id: string | number): Promise<Partial<User>> {
    const numericId = Number(id);
    try {
      const user = await this.userRepository.findOne(numericId, {
        relations: ['tasks', 'taskTypes', 'states'],
        select: this.safeSelect,
      });
      if (!user) {
        throw new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
      }
      return this.sanitize(user)!;
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async edit(id: string | number, data: { username: string; name: string }): Promise<void> {
    const numericId = Number(id);
    try {
      const user = await this.userRepository.findOne({ where: { id: numericId } });
      if (!user) {
        throw new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
      }
      user.username = data.username;
      user.name = data.name;
      try {
        await this.userRepository.save(user);
      } catch (err) {
        throw new CustomError(409, 'Raw', `User '${user.email}' can't be saved.`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async destroy(id: string | number): Promise<{ id: number; name: string; email: string }> {
    const numericId = Number(id);
    try {
      const user = await this.userRepository.findOne({ where: { id: numericId } });
      if (!user) {
        throw new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`]);
      }
      await this.userRepository.delete(numericId);
      return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        throw new CustomError(400, 'General', 'User already exists', [`Email '${existing.email}' already exists`]);
      }
      const newUser = new User();
      newUser.email = email;
      newUser.password = password;
      newUser.hashPassword();
      try {
        await this.userRepository.save(newUser);
      } catch (err) {
        throw new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user || !user.checkIfPasswordMatch(password)) {
        throw new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      }
      const jwtPayload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        created_at: user.created_at,
      };
      try {
        const token = createJwtToken(jwtPayload);
        return `Bearer ${token}`;
      } catch (err) {
        throw new CustomError(400, 'Raw', "Token can't be created", null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new CustomError(404, 'General', 'Not Found', [`User ${id} not found.`]);
      }
      if (!user.checkIfPasswordMatch(currentPassword)) {
        throw new CustomError(400, 'General', 'Not Found', ['Incorrect password']);
      }
      user.password = newPassword;
      user.hashPassword();
      await this.userRepository.save(user);
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async findByEmail(email: string): Promise<Partial<User> | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return this.sanitize(user);
    } catch (err) {
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }
}

export { UserService };
