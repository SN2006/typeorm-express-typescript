import { Request, Response, NextFunction } from 'express';

import { DeleteUserResponseDTO } from '../../dto/user/DeleteUserResponseDTO';
import { UserService } from '../../services/UserService';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const userService = new UserService();
  try {
    const user = await userService.destroy(id);

    res.customSuccess(200, 'User successfully deleted.', new DeleteUserResponseDTO(user));
  } catch (err) {
    return next(err);
  }
};
