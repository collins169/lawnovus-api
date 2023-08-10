import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { connectTolawnovusDB } from '../../database/manageConnections';
import { apiGatewayLambdaWrapper } from './wrapper';

jest.mock('../../database/manageConnections');
describe('lambda wrapper', () => {
  describe('apiGatewayLambdaWrapper', () => {
    it('calls event handler and sets context.callbackWaitsForEmptyEventLoop to false', async () => {
      const eventHandler = jest.fn();
      const event = {} as APIGatewayProxyEvent;
      const context = {
        callbackWaitsForEmptyEventLoop: true,
      } as Context;

      const wrapper = apiGatewayLambdaWrapper(eventHandler);
      await wrapper(event, context);

      expect(connectTolawnovusDB).toHaveBeenCalled();
      expect(eventHandler).toHaveBeenCalledWith(event, {
        callbackWaitsForEmptyEventLoop: false,
      });
    });

    it('does not connect to omni db when parameter withlawnovusDbConnection is false', async () => {
      const eventHandler = jest.fn();
      const event = {} as APIGatewayProxyEvent;
      const context = {
        callbackWaitsForEmptyEventLoop: true,
      } as Context;

      const wrapper = apiGatewayLambdaWrapper(eventHandler, {
        withlawnovusDBConnection: false,
      });
      await wrapper(event, context);

      expect(connectTolawnovusDB).not.toHaveBeenCalled();
    });
  });
});
