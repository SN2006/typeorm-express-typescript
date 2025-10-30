import { Request, Response, NextFunction } from 'express';

import StateService from '../../services/StateService';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;
  const stateService = new StateService();

  try {
    const deletedStateInfo = await stateService.deleteState(id, currentUserId);
    res.customSuccess(200, 'State successfully deleted.', deletedStateInfo);
  } catch (err) {
    return next(err);
  }
};
