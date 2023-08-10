import cors from 'cors';
import { cloneDeep } from 'lodash';
import { specifyCors } from './cors.middleware';

jest.mock('cors');

describe('specifyCors', () => {
  const oldEnv = cloneDeep(process.env);

  beforeEach(() => {
    process.env.NODE_ENV = 'local';
    process.env.FRONT_END_URL = 'http://app.dev.omnipresent.com';
  });
  afterEach(() => {
    process.env = cloneDeep(oldEnv);
  });

  it.each(['qa', 'dev'])('allows connections from localhost in the %s environment', (env) => {
    process.env.NODE_ENV = 'development';
    process.env.STAGE = env;
    specifyCors();
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: [
          'http://app.dev.omnipresent.com',
          'http://localhost:3000',
          'http://localhost:3001',
          /https:\/\/(?:[^.]+\.)?app\.dev\.omnipresent\.com/,
        ],
      }),
    );
  });
  it('only allows connections from the specified FRONT_END_URL in prod', () => {
    process.env.NODE_ENV = 'production';
    process.env.FRONT_END_URL = 'http://app.omnipresent.com';
    specifyCors();
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: ['http://app.omnipresent.com'],
      }),
    );
    expect(cors).not.toHaveBeenCalledWith(
      expect.objectContaining({
        origin: [
          'http://app.dev.omnipresent.com',
          'http://localhost:3000',
          'http://localhost:3001',
          /https:\/\/(?:[^.]+\.)?app\.dev\.omnipresent\.com/,
        ],
      }),
    );
  });

  it('only allows GET, PUT, POST, DELETE AND PATCH methods', () => {
    specifyCors();
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
      }),
    );
  });
  it('only allows Authorization and Content-Type headers', () => {
    specifyCors();
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        allowedHeaders: ['Authorization', 'Content-Type'],
      }),
    );
  });
  it('specifies that CORS headers be cached for two hours', () => {
    specifyCors();
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAge: 7200,
      }),
    );
  });
});
