import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { CelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import { logger } from '../helpers/logger';
import { TypeORMError } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpException) {
    const response = error.getResponse();
    const statusCode = error.getStatus();

    if (typeof response === 'string') {
      return res.status(statusCode).json({
        statusCode,
        message: error.message,
        error: 'HttpException',
      });
    }
    return res.status(error.getStatus()).json({
      message: (<Record<string, unknown>>response).message,
      statusCode,
      error: 'HttpException',
    });
  }

  if (error instanceof CelebrateError) {
    const messages: string[] = [];
    error.details.forEach(({ message }) => messages.push(message));

    const statusCode = HttpStatus.BAD_REQUEST;
    return res.status(statusCode).json({
      statusCode,
      message: messages.length === 1 ? messages[0] : messages,
      error: 'HttpException',
    });
  }

  if (error instanceof TypeORMError) {
    const statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    return res.status(statusCode).json({
      statusCode,
      message: error.message,
      error: 'EntityException',
    });
  }

  if (error instanceof TokenExpiredError) {
    const statusCode = HttpStatus.UNAUTHORIZED;
    return res.status(statusCode).json({
      statusCode,
      message: 'JWT token expired, kindly re-generate',
      error: 'TokenExpiredException',
    });
  }
  if (process.env.NODE_ENV === 'test') {
    console.error('error handler middleware', error);
  }

  logger.error(error);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: InternalServerErrorException.name,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred',
  });
};
