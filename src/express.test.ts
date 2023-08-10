import { HttpStatus } from '@nestjs/common';
import supertest from 'supertest';
import { expressAPI } from './express';

const request = supertest(expressAPI());

describe('OmniContractors-Api API', () => {
  it('returns 200 for any incoming requests', async () => {
    await request.get('/').expect(HttpStatus.OK);
  });
});
