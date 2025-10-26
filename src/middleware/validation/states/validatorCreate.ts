import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  let { name } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  name = !name ? '' : name;

  if (!name.trim()) {
    errorsValidation.push({ name: 'Name is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create state validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
