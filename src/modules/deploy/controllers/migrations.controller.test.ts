import { HttpStatus } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import supertest from 'supertest';
import { DataSource } from 'typeorm';

import { MIGRATION_KEY } from '../../../common/constants/ssmKeys.constants';
import { expressAPI } from '../../../express';
import { MIGRATION_KEY_HEADER } from '../deploy.routes';
import { SSMMockParams } from '../../../mocks/ssm.mock';
import SSMService from '../../../common/service/ssm.service';
import { connectTolawnovusDB } from '../../../database/manageConnections';

jest.mock('../../../common/service/ssm.service');
jest.mock('../../../database/manageConnections');

describe.skip('Migrations controller', () => {
  const request = supertest(expressAPI());
  const ssmMigrationParamValue = SSMMockParams[MIGRATION_KEY];
  const datasource = mock<DataSource>();
  beforeEach(async () => {
    await datasource.initialize();
    jest.mocked(connectTolawnovusDB).mockResolvedValue(datasource);
    jest.spyOn(SSMService.prototype, 'getParameter').mockResolvedValue(ssmMigrationParamValue);
  });

  describe('POST /deploy/migrations', () => {
    it('throws error if input migration key does not match value from ssm', async () => {
      const response = await request
        .post('/deploy/migrations')
        .set({ [MIGRATION_KEY_HEADER]: `${ssmMigrationParamValue}-wrong` });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Invalid migration key');
      expect(datasource.runMigrations).not.toHaveBeenCalled();
    });

    it('runs migrations once', async () => {
      jest.spyOn(SSMService.prototype, 'setParameter').mockImplementation(jest.fn());

      const res = await request
        .post('/deploy/migrations')
        .set({ [MIGRATION_KEY_HEADER]: ssmMigrationParamValue })
        .expect(HttpStatus.OK);

      expect(datasource.runMigrations).toHaveBeenNthCalledWith(1, {
        transaction: 'all',
      });

      expect(SSMService.prototype.setParameter).toHaveBeenCalledWith(MIGRATION_KEY, expect.any(String));

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('returns 200 even when resetting migration parameter fails', async () => {
      jest.spyOn(SSMService.prototype, 'setParameter').mockRejectedValue(new Error('test'));

      const res = await request.post('/deploy/migrations').set({
        [MIGRATION_KEY_HEADER]: ssmMigrationParamValue,
      });

      expect(datasource.runMigrations).toHaveBeenNthCalledWith(1, {
        transaction: 'all',
      });

      expect(SSMService.prototype.setParameter).toHaveBeenCalledWith(MIGRATION_KEY, expect.any(String));

      expect(res.status).toBe(HttpStatus.OK);
    });
  });
});
