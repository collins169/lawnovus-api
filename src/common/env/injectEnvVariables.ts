import { config } from 'dotenv';
import path from 'path';

const environmentMap = {
  test: '.dev',
  development: '.dev',
  production: '.prod',
};

export const injectEnvVariables = () => {
  const envFile = path.resolve(__dirname, '..', '..', '..', `.env${environmentMap[process.env.NODE_ENV || ''] || ''}`);
  const variables = config({
    path: envFile,
  }).parsed;

  process.env = {
    ...process.env,
    ...variables,
  };
};

injectEnvVariables();
