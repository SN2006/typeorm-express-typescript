import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const currentUserId = req.jwtPayload.id;

  const stateRepository = getRepository(State);
  try {
    const state = await stateRepository.findOne({ where: { id } });

    if (!state) {
      const customError = new CustomError(404, 'General', 'Not Found', [`State with id:${id} doesn't exist.`]);
      return next(customError);
    }

    if (state.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', ['You can only delete your own states.']);
      return next(customError);
    }

    await stateRepository.delete(id);

    res.customSuccess(200, 'State successfully deleted.', { id: state.id, name: state.name });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
