import { Context, Callback, EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import { connectTolawnovusDB } from '../../database/manageConnections';
import { get, cloneDeep } from 'lodash';
import { logger } from '../helpers/logger';

type LambdaWrapperOptions = {
  withlawnovusDBConnection?: boolean;
};

const defaultOptions: LambdaWrapperOptions = {
  withlawnovusDBConnection: true,
};

const getOptions = (options?: LambdaWrapperOptions): LambdaWrapperOptions => {
  return Object.entries(defaultOptions).reduce((accumulator, [key, value]) => {
    accumulator[key] = get(options, key, value);
    return accumulator;
  }, cloneDeep(defaultOptions));
};

const updateLambdaContext = (context: Context): Context => {
  return {
    ...context,
    callbackWaitsForEmptyEventLoop: false,
  };
};

const defaultLambdaWrapper = async (context: Context, options?: LambdaWrapperOptions): Promise<Context> => {
  const parsedOptions = getOptions(options);

  if (parsedOptions.withlawnovusDBConnection) {
    logger.info('Connecting to Database');
    await connectTolawnovusDB();
    logger.info('connected to Database');
  }

  return updateLambdaContext(context);
};

export const apiGatewayLambdaWrapper = (
  eventHandler: serverless.Handler,
  options?: LambdaWrapperOptions,
): serverless.Handler => {
  return async (event, context: Context) => {
    const updatedContext = await defaultLambdaWrapper(context, options);

    return eventHandler(event, updatedContext);
  };
};

export const eventBridgeLambdaWrapper = <TDetailType extends string, TDetail, TResult>(
  eventHandler: EventBridgeHandler<TDetailType, TDetail, TResult>,
  options?: LambdaWrapperOptions,
) => {
  return async (
    event: EventBridgeEvent<TDetailType, TDetail>,
    context: Context,
    callback: Callback<TResult>,
  ): Promise<TResult | void> => {
    const updatedContext = await defaultLambdaWrapper(context, options);

    return eventHandler(event, updatedContext, callback);
  };
};
