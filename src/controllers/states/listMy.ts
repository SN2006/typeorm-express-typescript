import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { State } from 'orm/entities/states/State';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const listMy = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;
  const stateRepository = getRepository(State);

  try {
    const states = await stateRepository.find({
      where: { userId },
      relations: ['user'],
      select: ['id', 'name', 'created_at', 'updated_at'],
    });
    res.customSuccess(200, 'List of your states.', states);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of states.`, null, err);
    return next(customError);
  }
};
