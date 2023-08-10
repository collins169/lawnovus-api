import { DataSource } from 'typeorm';
import { connectTolawnovusDB } from './manageConnections';

export const getEntityManager = async () => {
  const datasource: DataSource = await connectTolawnovusDB();
  return datasource.manager;
};
