import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name } = req.body;
  const currentUserId = req.jwtPayload.id;

  const stateRepository = getRepository(State);
  try {
    const state = await stateRepository.findOne({ where: { id } });

    if (!state) {
      const customError = new CustomError(404, 'General', `State with id:${id} not found.`, ['State not found.']);
      return next(customError);
    }

    if (state.userId !== currentUserId) {
      const customError = new CustomError(403, 'General', 'Access denied', ['You can only edit your own states.']);
      return next(customError);
    }

    if (name) {
      state.name = name;
    }

    try {
      await stateRepository.save(state);
      res.customSuccess(200, 'State successfully updated.', state);
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `State can't be updated.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
