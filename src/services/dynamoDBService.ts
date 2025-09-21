import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { dynamoDBClient, dynamoDBConfig } from '@/lib/aws-config';
import { BlogMetadata, BlogApiResponse } from '@/types';

// Simple in-memory cache
let cachedBlogPosts: BlogMetadata[] | null = null;
let lastCacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class DynamoDBService {
  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = dynamoDBClient;
    this.tableName = dynamoDBConfig.tableName;
  }

  async getBlogPostMetaBySlug(
    slug: string
  ): Promise<BlogApiResponse<BlogMetadata>> {
    try {
      const command = new GetItemCommand({
        TableName: this.tableName,
        Key: {
          slug: { S: slug },
        },
      });

      const response = await this.client.send(command);

      if (!response.Item) {
        return {
          success: false,
          error: 'Blog post not found',
          cacheStatus: 'MISS',
        };
      }

      const post = unmarshall(response.Item) as BlogMetadata;

      return {
        success: true,
        data: post,
        cacheStatus: 'HIT',
      };
    } catch (error) {
      console.error(`Error fetching blog post meta for slug "${slug}":`, error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async getAllBlogPostsMeta(): Promise<BlogApiResponse<BlogMetadata[]>> {
    const now = Date.now();
    if (cachedBlogPosts && lastCacheTime && now - lastCacheTime < CACHE_DURATION) {
      return {
        success: true,
        data: cachedBlogPosts,
        cacheStatus: 'HIT',
      };
    }

    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        // ProjectionExpression can be used to return only specific attributes
        // This reduces payload size and improves performance.
        // Example: ProjectionExpression: "slug, title, description, publishedAt, tags"
      });

      const response = await this.client.send(command);
      const posts =
        response.Items?.map(item => unmarshall(item) as BlogMetadata) || [];
      
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      cachedBlogPosts = posts;
      lastCacheTime = now;

      return {
        success: true,
        data: posts,
        cacheStatus: 'MISS',
      };
    } catch (error) {
      console.error('Error fetching all blog post metas:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  invalidateCache(): void {
    cachedBlogPosts = null;
    lastCacheTime = null;
    console.log('DynamoDB cache invalidated.');
  }
}

export const dynamoDBService = new DynamoDBService();
