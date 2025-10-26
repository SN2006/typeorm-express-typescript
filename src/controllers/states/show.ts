import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const stateRepository = getRepository(State);
  try {
    const state = await stateRepository.findOne(id, {
      relations: ['user'],
      select: ['id', 'name', 'created_at', 'updated_at'],
    });

    if (!state) {
      const customError = new CustomError(404, 'General', `State with id:${id} not found.`, ['State not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'State found', state);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
