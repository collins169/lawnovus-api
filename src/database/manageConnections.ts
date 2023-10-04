import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { logger } from '../common/helpers/logger';
import { getConnectionOpts } from './getConnectionOpts';

const connect = async (connection: DataSource, host: string): Promise<void> => {
  try {
    await connection.destroy();
    await connection.initialize();
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
  const config = await getConnectionOpts();
  const dataSource = new DataSource({
    ...config,
    extra: {
      max: 1, // set pool max size
    },
  });
  if (!dataSource.isInitialized) {
    await connect(dataSource, (dataSource.options as PostgresConnectionOptions).host);
  }
  return dataSource;
};
