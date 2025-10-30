import { Request, Response, NextFunction } from 'express';

import { UpdateStateDTO } from '../../dto/state/UpdateStateDTO';
import StateService from '../../services/StateService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const userId = req.jwtPayload.id;
  const stateService = new StateService();

  try {
    const state = await stateService.createState(name, userId);
    res.customSuccess(201, 'State successfully created.', new UpdateStateDTO(state));
  } catch (err) {
    return next(err);
  }
};
