import { SSMClient, GetParameterCommand, PutParameterCommand, GetParametersCommand } from '@aws-sdk/client-ssm/';
import { logger } from '../helpers/logger';

class SSMService {
  private readonly ssm: SSMClient;

  constructor() {
    // Initialize the AWS.SSM object with your AWS credentials
    this.ssm = new SSMClient({
      region: process.env.AWS_REGION || 'eu-north-1',
    });
  }

  async getParameter(name: string): Promise<string> {
    try {
      const command = new GetParameterCommand({
        Name: name,
        WithDecryption: true,
      });
      const result = await this.ssm.send(command);
      return result.Parameter?.Value ?? '';
    } catch (err) {
      logger.error({
        action: 'ssm.service.error',
        message: `Call to get parameter ${name} failed`,
        error: err,
      });
      throw err;
    }
  }

  async setParameter(name: string, value: string): Promise<void> {
    try {
      const commands = new PutParameterCommand({
        Name: name,
        Value: value,
        Type: 'SecureString',
        Overwrite: true,
      });
      await this.ssm.send(commands);
    } catch (err) {
      logger.error({
        action: 'ssm.service.error',
        message: `Call to set parameter ${name} failed`,
        error: err,
      });
      throw err;
    }
  }

  async getParameters(names: string[]): Promise<{ [key: string]: string }> {
    try {
      const commands = new GetParametersCommand({
        Names: names,
        WithDecryption: true,
      });
      const result = await this.ssm.send(commands);
      if (!result.Parameters) {
        return {};
      }
      return result.Parameters?.reduce(
        (obj, { Name, Value }) => Object.assign(obj, { [Name as string]: Value }),
        {} as { [key: string]: string },
      );
    } catch (err) {
      logger.error({
        action: 'ssm.service.error',
        message: `Call to get parameter ${names.join(', ')} failed`,
        error: err,
      });

      throw err;
    }
  }
}

export default SSMService;
