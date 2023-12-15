import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { logger } from '../common/helpers/logger';
import { getConnectionOpts } from './getConnectionOpts';

const connect = async (connection: DataSource, host: string): Promise<void> => {
  try {
    logger.info('Connecting to Database');
    await connection.initialize();
    logger.info('connected to Database');
  } catch (error) {
    logger.error({
      action: 'typeorm.connection.connect.error',
      message: `Failed to connect to database at "${host}"`,
      error,
    });
    throw error;
  }
};

export const connectTolawnovusDB = async (): Promise<DataSource> => {
  const dataSource = new DataSource(await getConnectionOpts());
  if (!dataSource.isInitialized) {
    logger.info('reconnecting to database');
    await connect(dataSource, (dataSource.options as PostgresConnectionOptions).host);
  }
  return dataSource;
};
