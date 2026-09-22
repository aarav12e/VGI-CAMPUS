import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message: string = 'Operation successful', statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

export function sendError(res: Response, code: string, message: string, statusCode: number = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}
