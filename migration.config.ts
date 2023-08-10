import { DataSource } from 'typeorm';
import './src/common/env/injectEnvVariables';
import { IndexNamingStrategy } from './src/database/indexNamingStrategy';

// For local migration usage only
const datasource = new DataSource({
  name: 'lawnovus_db',
  type: 'postgres',
  host: 'localhost',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: false,
  logging: true,
  database: 'lawnovus_db',
  port: 2345,
  migrations: ['./src/database/migrations/*.ts', './src/**/migrations/typeorm/*.ts'],
  entities: ['./src/**/entities/*.ts'],
  entityPrefix: 'local-',
  migrationsTableName: 'local-migrations',
  namingStrategy: new IndexNamingStrategy(),
});
if (!datasource.isInitialized) {
  datasource.initialize();
}
export default datasource;
