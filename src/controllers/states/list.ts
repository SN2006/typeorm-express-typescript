import { Request, Response, NextFunction } from 'express';

import { StateDTO } from '../../dto/state/StateDTO';
import StateService from '../../services/StateService';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const stateService = new StateService();

  try {
    const states = (await stateService.getAllStates()).map((state) => new StateDTO(state));
    res.customSuccess(200, 'List of states.', states);
  } catch (err) {
    return next(err);
  }
};
