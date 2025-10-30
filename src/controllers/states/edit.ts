import { Request, Response, NextFunction } from 'express';

import { UpdateStateDTO } from '../../dto/state/UpdateStateDTO';
import StateService from '../../services/StateService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  const currentUserId = req.jwtPayload.id;

  const stateService = new StateService();
  try {
    const state = await stateService.updateState(id, name, currentUserId);
    res.customSuccess(200, 'State successfully updated.', new UpdateStateDTO(state));
  } catch (err) {
    return next(err);
  }
};
