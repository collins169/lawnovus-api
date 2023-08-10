import { createLogger, Logger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const logger: Logger = createLogger({
  format: format.json(),
  transports: [new transports.Console()],
});
if (['dev', 'prod'].includes(process.env.STAGE)) {
  const cloudwatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION || 'eu-north-1',
    messageFormatter: ({ level, message, additionalInfo }) =>
      `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`,
  };
  logger.add(new WinstonCloudWatch(cloudwatchConfig));
}

export { logger };
