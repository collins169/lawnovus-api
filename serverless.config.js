const baseDevConfig = {
  awsProfile: 'default',
  resourcesRef: 'full',
  stackName: 'lawnovus-api-local',
  apiName: 'local-lawnovus-api',
  domainName: 'NOT_APPLICABLE',
  certificateName: 'NOT_APPLICABLE',
  hostedZoneIds: 'Z02679983K750MIWB2C9N',
  numberOfLambdaVersions: 0,
  resources: {},
  serverlessBucketName: 'lawnovus-serverless-deployment-bucket-dev',
  env: {
    COUNTRY_CODE: 'GH',
  },
};

const configMap = {
  local: {
    ...baseDevConfig,
    env: {
      ...baseDevConfig.env,
      NODE_ENV: 'development',
      DATABASE_USERNAME: 'lawnovus_db',
      DATABASE_PASSWORD: 'lawnovus_db_password',
      FRONT_END_URL: 'http://localhost:3000',
      DOCUMENT_BUCKET_NAME: 'test-bucket',
    },
    restApi: {
      accessLoggingEnabled: false,
      executionLoggingEnabled: false,
    },
    dbMigration: {
      migrationKey: 'default',
      url: 'http://localhost:4000',
    },
  },
  dev: {
    ...baseDevConfig,
    stackName: 'lawnovus-api-dev',
    apiName: 'dev-lawnovus-api-api',
    domainName: 'api.dev.lawnovus.com',
    certificateName: 'api.dev.lawnovus.com',
    env: {
      ...baseDevConfig.env,
      NODE_ENV: 'development',
      FRONT_END_URL: 'https://app.dev.lawnovus.com',
      CLOUDWATCH_GROUP_NAME: '${ssm:/dev/cloudwatch/log/GROUP_NAME}',
      DOCUMENT_BUCKET_NAME: 'lawnovus-document-storage-bucket',
    },
    restApi: {
      accessLoggingEnabled: false,
      executionLoggingEnabled: false,
    },
    dbMigration: {
      migrationKey: '${ssm:/dev/database/lawnovus_db/MIGRATION_KEY}',
      url: 'https://api.dev.lawnovus.com',
    },
  },
  prod: {
    ...baseDevConfig,
    stackName: 'lawnovus-api-prod',
    apiName: 'prod-lawnovus-api-api',
    domainName: 'api.lawnovus.com',
    certificateName: 'api.lawnovus.com',
    numberOfLambdaVersions: 3,
    env: {
      ...baseDevConfig.env,
      NODE_ENV: 'production',
      FRONT_END_URL: 'https://app.lawnovus.com',
      CLOUDWATCH_GROUP_NAME: '${ssm:/prod/cloudwatch/log/GROUP_NAME}',
      DOCUMENT_BUCKET_NAME: 'lawnovus-document-storage-bucket-prod',
    },
    serverlessBucketName: 'lawnovus-serverless-deployment-bucket-prod',
    restApi: {
      accessLoggingEnabled: true,
      executionLoggingEnabled: false,
    },
    dbMigration: {
      migrationKey: '${ssm:/prod/database/lawnovus_db/MIGRATION_KEY}',
      url: 'https://api.lawnovus.com',
    },
  },
};

module.exports = async ({ options }) => {
  const stage = options.stage || 'local';
  const config = configMap[stage];

  return {
    ...config,
    env: {
      ...config.env,
      STAGE: stage,
      IS_E2E: process.env.IS_E2E,
    },
  };
};
