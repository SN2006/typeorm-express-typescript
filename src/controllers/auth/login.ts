import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services/UserService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userService = new UserService();
  try {
    const token = await userService.login(email, password);
    res.customSuccess(200, 'Token successfully created.', `${token}`);
  } catch (err) {
    return next(err);
  }
};
