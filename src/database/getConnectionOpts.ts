import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { TypeORMConnections } from './connections';
import SSMService from '../common/service/ssm.service';
import { IndexNamingStrategy } from './indexNamingStrategy';
import 'dotenv/config';
import { logger } from '../common/helpers/logger';

type DatabaseCredentials = {
  host: string;
  port?: number;
  username: string;
  password: string;
  database?: string;
};

export const getLawnovusDBCredentials = async (): Promise<DatabaseCredentials> => {
  if (process.env.STAGE === 'local') {
    return {
      host: 'localhost',
      port: 2345,
      username: process.env.DATABASE_USERNAME || '',
      password: process.env.DATABASE_PASSWORD || '',
    };
  }

  const ssmService = new SSMService();

  const databaseVariables = await ssmService.getParameters([
    `/${process.env.STAGE}/database/lawnovus_db/DATABASE_URL`,
    `/${process.env.STAGE}/database/lawnovus_db/DATABASE_USERNAME`,
    `/${process.env.STAGE}/database/lawnovus_db/DATABASE_PASSWORD`,
    `/${process.env.STAGE}/database/lawnovus_db/DATABASE_NAME`,
  ]);

  return {
    host: databaseVariables[`/${process.env.STAGE}/database/lawnovus_db/DATABASE_URL`],
    username: databaseVariables[`/${process.env.STAGE}/database/lawnovus_db/DATABASE_USERNAME`],
    password: databaseVariables[`/${process.env.STAGE}/database/lawnovus_db/DATABASE_PASSWORD`],
    database: databaseVariables[`/${process.env.STAGE}/database/lawnovus_db/DATABASE_NAME`],
  };
};

export const getConnectionOpts = async (): Promise<DataSourceOptions> => {
  const dbCredentials = await getLawnovusDBCredentials();

  const dbPrefix = process.env.STAGE;

  return {
    name: TypeORMConnections.lawnovusDB,
    type: 'postgres',
    ssl: process.env.STAGE === 'local' ? false : { rejectUnauthorized: false },
    logging: process.env.STAGE === 'local',
    database: 'lawnovus_db',
    port: 5432,
    entities: [join(__dirname, '..', '**/entities/*.{ts,js}')],
    migrations: [join(__dirname, '..', '/database/migrations/*.{ts,js}')],
    ...dbCredentials,
    entityPrefix: `${dbPrefix}-`,
    migrationsTableName: `${dbPrefix}-migrations`,
    namingStrategy: new IndexNamingStrategy(),
  };
};
