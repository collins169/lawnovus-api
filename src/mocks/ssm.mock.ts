import { AppSsmKeys } from '../common/constants/ssmKeys';

export const SSMMockParams = {
  [AppSsmKeys.JWT_SECRET]: 'testsecret',
  [AppSsmKeys.MIGRATION_KEY]: 'test',
  [AppSsmKeys.DB_URL]: 'mocked',
  [AppSsmKeys.DB_USERNAME]: 'mocked',
  [AppSsmKeys.DB_PASSWORD]: 'mocked',
};
