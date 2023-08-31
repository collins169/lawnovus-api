import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import supertest from 'supertest';
import * as ctrl from '../../modules/deploy/controllers/migrations.controller';
import { MIGRATION_KEY_HEADER } from '../../modules/deploy/deploy.routes';
import { expressAPI } from '../../express';

jest.mock('../../modules/deploy/controllers/migrations.controller');

describe('Error Handler Middleware', () => {
  const request = supertest(expressAPI());

  describe('4xx errors', () => {
    it('returns error message as array', async () => {
      jest.spyOn(ctrl, 'runMigrations').mockRejectedValue(new BadRequestException(['bad request']));

      const res = await request.post('/deploy/migrations').set({ [MIGRATION_KEY_HEADER]: 'foo' });

      expect(res.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: expect.any(Array),
        error: 'HttpException',
      });
    });

    it('returns error message as string', async () => {
      jest.spyOn(ctrl, 'runMigrations').mockRejectedValue(new HttpException('Conflict', HttpStatus.CONFLICT));

      const res = await request.post('/deploy/migrations').set({ [MIGRATION_KEY_HEADER]: 'foo' });

      expect(res.body).toEqual({
        statusCode: HttpStatus.CONFLICT,
        message: 'Conflict',
        error: 'HttpException',
      });
    });

    it('returns error when key is not passed', async () => {
      jest.spyOn(ctrl, 'runMigrations');

      const res = await request.post('/deploy/migrations');

      expect(res.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: expect.any(String),
        error: 'HttpException',
      });
    });
  });

  it('returns 5XX error for unexpected errors', async () => {
    jest.spyOn(ctrl, 'runMigrations').mockRejectedValue(new Error());

    const res = await request.post('/deploy/migrations').set({ [MIGRATION_KEY_HEADER]: 'foo' });

    expect(res.body).toEqual({
      statusCode: 500,
      message: 'An unexpected error occurred',
      error: 'InternalServerErrorException',
    });
  });
});
