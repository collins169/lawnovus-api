const pg = require('pg');

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const maxNumberOfAttempts = 60;
const interval = 5000;

(async () => {
  let numberOfAttempts = 0;

  while (true) {
    try {
      console.log('Attempting to connect to local database...');

      const client = new pg.Client('postgres://lawnovus_db:lawnovus_db_password@localhost:2345/lawnovus_db');

      await client.connect();

      console.log('Connection successful! Exiting...');

      await client.end();

      process.exit(0);
    } catch (error) {
      numberOfAttempts += 1;
      if (numberOfAttempts >= maxNumberOfAttempts) {
        break;
      }

      console.log(`Connection failed, retrying in ${interval}ms.`);
      await delay(interval);
    }
  }

  console.log(
    `Attempted ${numberOfAttempts} times to connect to postgres locally, but was unsuccesful. Exiting with error.`,
  );

  process.exit(1);
})();
