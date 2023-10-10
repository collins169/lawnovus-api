import { DataSource } from 'typeorm';
import { BaseModel } from '../common/models/base.model';
import { connectTolawnovusDB } from './manageConnections';

export const getEntityRepository = async <T>(entity: { new (): T }) => {
  const datasource: DataSource = await connectTolawnovusDB();
  return datasource.manager.getRepository<T>(entity.name);
};
