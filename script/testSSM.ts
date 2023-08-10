import { MIGRATION_KEY } from './../src/common/constants/ssmKeys.constants';
import SSMService from '../src/common/service/ssm.service';
const run = async () => {
  console.log('calling ssm');
  const ssmService = new SSMService();
  const ssmMigrationParamValue = await ssmService.getParameter(MIGRATION_KEY);
  console.log({ ssmMigrationParamValue });
};

setTimeout(async () => {
  await run();
}, 500);
