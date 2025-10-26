import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (name !== undefined && !name.trim()) {
    errorsValidation.push({ name: 'Name cannot be empty' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Edit task type validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
