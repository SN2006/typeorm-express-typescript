import { Request, Response, NextFunction } from 'express';

import { StateDTO } from '../../dto/state/StateDTO';
import StateService from '../../services/StateService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const stateService = new StateService();

  try {
    const state = await stateService.getStateById(id);
    res.customSuccess(200, 'State found', new StateDTO(state));
  } catch (err) {
    return next(err);
  }
};
