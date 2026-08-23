import { AppError } from '../utils/AppError.js';

// Validates req[source] (body/query) against a Zod schema.
// On success, replaces req[source] with the parsed+coerced data (e.g. query
// strings turned into numbers) so downstream code can trust the shape.
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      const err = new AppError('Validation failed', 422, 'VALIDATION_ERROR');
      err.details = details;
      return next(err);
    }
    req[source] = result.data;
    next();
  };
}
