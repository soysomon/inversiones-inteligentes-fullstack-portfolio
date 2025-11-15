import { ApiError } from './ApiError.js';

export const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};