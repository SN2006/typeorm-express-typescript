import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services/UserService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { username, name } = req.body;

  const userService = new UserService();
  try {
    await userService.edit(id, { username, name });
    res.customSuccess(200, 'User successfully saved.');
  } catch (err) {
    return next(err);
  }
};
