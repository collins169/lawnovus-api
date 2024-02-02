import { Search } from './../entities/search.entity';
import { getEntityRepository } from '../../../database/getEntityRepository';

export const getSearchRepository = async () => {
  return getEntityRepository(Search);
};

export const searchCatalog = async (param: string) => {
  const repository = await getSearchRepository();
  return repository
    .createQueryBuilder('search')
    .where(
      // eslint-disable-next-line quotes
      "(search.title ILIKE :param OR array_to_string(search.judges, ',') ILIKE :param OR search.keyWords ILIKE :param OR search.jurisdiction ILIKE :param OR author->>'name' ILIKE :param OR author->>'bio' ILIKE :param)",
    )
    .orderBy('search.title', 'DESC')
    .setParameters({ param: `%${param}%` })
    .getMany();
};
