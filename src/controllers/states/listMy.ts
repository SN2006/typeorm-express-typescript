import { Request, Response, NextFunction } from 'express';

import { StateDTO } from '../../dto/state/StateDTO';
import StateService from '../../services/StateService';

export const listMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;
  const stateService = new StateService();

  try {
    const states = (await stateService.getMyStates(userId)).map((state) => new StateDTO(state));
    res.customSuccess(200, 'List of your states.', states);
  } catch (err) {
    return next(err);
  }
};
