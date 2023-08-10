import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';

const tablePrefix = ['dev', 'prod'];

const stripTablePrefix = (name: string): string => {
  const parts = name.split(/_|-/);

  tablePrefix.includes(parts[0]) && parts.shift();

  return parts.join('_');
};

const combineColumnNames = (columnNames: string[]): string => {
  const normalizeColumnName = (columnName) => columnName.split('-').join('_');
  const normalizedColumnNames = columnNames.map(normalizeColumnName);

  return normalizedColumnNames.reduce((acc, column) => `${acc}-${column}`);
};

export class IndexNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableOrCustomName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `fk-${stripTablePrefix(tableOrCustomName)}-${combineColumnNames(columnNames)}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[]): string {
    const tableOrCustomName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `idx-${stripTablePrefix(tableOrCustomName)}-${combineColumnNames(columnNames)}`;
  }

  primaryKeyName(tableOrName: Table | string): string {
    const tableOrCustomName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    return `pk-${stripTablePrefix(tableOrCustomName)}`;
  }
}
