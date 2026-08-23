import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

// Validates :id route params are well-formed Mongo ObjectIds before hitting the DB.
// Prevents Mongoose CastErrors from leaking as 500s for malformed IDs.
export function validateObjectId(paramName = 'id') {
  return (req, _res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return next(new AppError(`Invalid ${paramName}`, 400, 'INVALID_ID'));
    }
    next();
  };
}
