import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const userId = req.jwtPayload.id;

  const stateRepository = getRepository(State);

  try {
    const state = new State();
    state.name = name;
    state.userId = userId;

    try {
      await stateRepository.save(state);
      res.customSuccess(201, 'State successfully created.', state);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `State can't be created.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
