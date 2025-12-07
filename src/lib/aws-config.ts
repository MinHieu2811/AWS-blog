import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const awsConfig = {
  region: process.env.AWS_REGION || 'ap-southeast-1',
};

export const s3Config = {
  sourceBucketName:
    process.env.S3_SOURCE_BUCKET_NAME || '',
  sourcePrefix: process.env.S3_SOURCE_PREFIX || 'blog-post/',
  sourceContentFileName: process.env.S3_SOURCE_CONTENT_FILETYPE || 'mdx',
  sourceSlugIsFileName: process.env.S3_SOURCE_SLUG_IS_FILENAME !== 'false',
  region: process.env.AWS_REGION || 'ap-southeast-1',
};

export const dynamoDBConfig = {
  tableName: process.env.DYNAMODB_TABLE_NAME || 'blog-metadata',
  region: process.env.AWS_REGION || 'ap-southeast-1',
};

export const s3Client = new S3Client({
  region: awsConfig.region,
});

export const dynamoDBClient = new DynamoDBClient({
  region: awsConfig.region,
});

export const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
