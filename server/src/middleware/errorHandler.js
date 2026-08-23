import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  // Translate known Mongoose errors into AppErrors so the response shape stays consistent.
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    error = new AppError('Validation failed', 422, 'VALIDATION_ERROR');
    error.details = details;
  } else if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}`, 400, 'INVALID_ID');
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`A record with that ${field} already exists`, 409, 'DUPLICATE_RECORD');
  } else if (!(err instanceof AppError)) {
    // Unexpected/programmer error — never leak internals to the client.
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', err);
    error = new AppError('Something went wrong', 500, 'INTERNAL_ERROR');
  }

  const body = {
    success: false,
    message: error.message,
    error: { code: error.code || 'INTERNAL_ERROR' },
  };
  if (error.details) body.error.details = error.details;
  if (env.nodeEnv === 'development' && err.stack && error.statusCode >= 500) {
    body.error.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(body);
}
