import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

export const s3Config = {
  bucketName: process.env.S3_BUCKET_NAME || '',
  blogPrefix: process.env.S3_BLOG_PREFIX || 'blog-posts/',
  region: process.env.AWS_REGION || 'us-east-1',
};

export const dynamoDBConfig = {
  tableName: process.env.DYNAMODB_TABLE_NAME || 'blog-metadata',
  region: process.env.DYNAMODB_REGION || 'us-east-1',
};

export const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: awsConfig.credentials,
});

export const dynamoDBClient = new DynamoDBClient({
  region: awsConfig.region,
  credentials: awsConfig.credentials,
});

export const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
