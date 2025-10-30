import { Request, Response, NextFunction } from 'express';

import { UserDTO } from '../../dto/user/UserDTO';
import { UserService } from '../../services/UserService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const userService = new UserService();
  try {
    const user = await userService.show(id);

    res.customSuccess(200, 'User found', new UserDTO(user));
  } catch (err) {
    return next(err);
  }
};
