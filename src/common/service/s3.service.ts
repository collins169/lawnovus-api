import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { logger } from '../helpers/logger';

export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    if (process.env.STAGE === 'local') {
      this.s3 = new S3Client({
        region: process.env.AWS_REGION || 'eu-north-1',
        forcePathStyle: true,
        endpoint: 'http://localhost:4200',
        credentials: {
          accessKeyId: 'S3RVER',
          secretAccessKey: 'S3RVER',
        },
      });
    } else {
      this.s3 = new S3Client({
        region: process.env.AWS_REGION || 'eu-north-1',
        apiVersion: '2006-03-01',
      });
    }
  }

  public async createBucket(): Promise<void> {
    const command = new CreateBucketCommand({ Bucket: this.bucketName });
    await this.s3.send(command);
    logger.info(`S3 bucket "${this.bucketName}" created successfully.`);
  }

  public async uploadFile(fileData: Buffer, s3Key: string): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: fileData,
      });
      logger.info(` S3 bucket "${this.bucketName}" with key "${s3Key}".`);
      await this.s3.send(command);
    } catch (error) {
      logger.error('Error uploading file to S3 bucket:', error);
      throw error;
    }
  }

  public async downloadFile(s3Key: string, localFilePath: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });
      const response = await this.s3.send(command);
      logger.info(`File with key "${s3Key}" downloaded from S3 bucket "${this.bucketName}" to "${localFilePath}".`);
      return Buffer.from(response.Body as unknown as Buffer);
    } catch (error) {
      logger.error('Error downloading file from S3 bucket:', error);
      throw error;
    }
  }

  public async deleteFile(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });
    await this.s3.send(command);
    logger.info(`File with key "${s3Key}" deleted from S3 bucket "${this.bucketName}".`);
  }

  public async getObjectPresignedUrl(s3Key: string, expiry: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: s3Key });
    const url = await getSignedUrl(this.s3, command, { expiresIn: expiry }); // expires in seconds
    return url;
  }
}
