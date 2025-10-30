import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services/UserService';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordNew } = req.body;
  const { id } = req.jwtPayload;

  const userService = new UserService();
  try {
    await userService.changePassword(id, password, passwordNew);
    res.customSuccess(200, 'Password successfully changed.');
  } catch (err) {
    return next(err);
  }
};
