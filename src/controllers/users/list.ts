import { Request, Response, NextFunction } from 'express';

import { ListedUserDTO } from '../../dto/user/ListedUserDTO';
import { UserService } from '../../services/UserService';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService();
  try {
    const users = await userService.list().then((users) => users.map((user) => new ListedUserDTO(user)));
    res.customSuccess(200, 'List of users.', users);
  } catch (err) {
    return next(err);
  }
};
