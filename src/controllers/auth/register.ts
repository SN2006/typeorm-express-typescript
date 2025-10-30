import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services/UserService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userService = new UserService();
  try {
    await userService.register(email, password);
    res.customSuccess(200, 'User successfully created.');
  } catch (err) {
    return next(err);
  }
};
