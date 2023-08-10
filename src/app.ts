import serverless from 'serverless-http';
import { expressAPI } from './express';
import { apiGatewayLambdaWrapper } from './common/lambda/wrapper';

export const handler: serverless.Handler = apiGatewayLambdaWrapper(serverless(expressAPI()));
