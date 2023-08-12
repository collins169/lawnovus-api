import { addAdmin } from './../src/modules/admin/services/administrator.service';
import { connectTolawnovusDB } from './../src/database/manageConnections';
import { AdministratorTypes } from './../src/modules/users/types/user.types';
import yargs from 'yargs';

const yargsConfig = yargs
  .scriptName('create-admin-user')
  .usage('$0 [args]')
  .strict()
  .option('name', {
    alias: 'name',
    demandOption: true,
    describe: 'Admin name',
    type: 'string',
  })
  .option('username', {
    alias: 'username',
    demandOption: true,
    describe: 'Admin username',
    type: 'string',
  })
  .option('password', {
    alias: 'password',
    demandOption: true,
    describe: 'Admin password',
    type: 'string',
  })
  .option('role', {
    alias: 'role',
    demandOption: true,
    describe: 'Admin role',
    type: 'string',
  })
  .option('email', {
    alias: 'email',
    demandOption: true,
    describe: 'Admin email',
    type: 'string',
  })
  .option('phone', {
    alias: 'phone',
    demandOption: false,
    describe: 'Admin phone',
    type: 'string',
  })
  .option('dry-run', {
    default: false,
    describe: 'if true nothing will be changed in DB',
    type: 'boolean',
  })
  .check((argv) => {
    const role = argv['role'];
    if (role in AdministratorTypes) {
      return true;
    }
    throw new Error(`--role needs to be any of this: ${Object.keys(AdministratorTypes).toString()}`);
  })
  .help();

(async () => {
  const argv = await yargsConfig.argv;
  const { name, role, username, password, phone, email, 'dry-run': dryRun } = argv;

  try {
    await connectTolawnovusDB();
  } catch (error) {
    console.error('Could not connect to database', error);
    process.exit(1);
  }

  if (dryRun) {
    console.info(
      `Dry run enabled! Would create admin with the following details > name: ${name}, username: ${username}, password: ${password}, role: ${role}, phone number: ${phone}, email: ${email}`,
    );
    process.exit(0);
  }
  const admin = await addAdmin(
    {
      username,
      password,
      role: AdministratorTypes[role],
      contactDetail: {
        name,
        phone: phone || '',
        email,
        address: '',
      },
    },
    'script',
  );
  console.log({ admin });
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
