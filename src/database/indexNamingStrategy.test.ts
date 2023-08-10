import { IndexNamingStrategy } from './indexNamingStrategy';

describe('IndexNamingStrategy', () => {
  it('creates correct names for foreign keys', () => {
    const strategy = new IndexNamingStrategy();
    const columnNames = ['country-id', 'type_id'];
    const fkName = strategy.foreignKeyName('dev-simple-table', columnNames);
    const fkName2 = strategy.foreignKeyName('prod-simple-table', columnNames);

    expect(fkName).toBe('fk-simple_table-country_id-type_id');
    expect(fkName2).toBe('fk-simple_table-country_id-type_id');
  });

  it('creates correct names for indexes', () => {
    const strategy = new IndexNamingStrategy();
    const columnNames = ['country-id', 'type_id'];
    const fkName = strategy.indexName('dev-simple-table', columnNames);
    const fkName2 = strategy.indexName('prod-simple-table', columnNames);

    expect(fkName).toBe('idx-simple_table-country_id-type_id');
    expect(fkName2).toBe('idx-simple_table-country_id-type_id');
  });

  it('creates correct names for primary keys', () => {
    const strategy = new IndexNamingStrategy();
    const fkName = strategy.primaryKeyName('dev-simple-table');
    const fkName2 = strategy.primaryKeyName('prod-simple-table');

    expect(fkName).toBe('pk-simple_table');
    expect(fkName2).toBe('pk-simple_table');
  });
});
