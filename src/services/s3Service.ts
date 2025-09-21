import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client, s3Config } from '@/lib/aws-config';
import { S3Object, S3ListResponse, BlogApiResponse } from '@/types';

export class S3Service {
  private bucketName: string;
  private blogPrefix: string;

  constructor() {
    this.bucketName = s3Config.bucketName;
    this.blogPrefix = s3Config.blogPrefix;
  }

  async getMarkdownFile(key: string): Promise<BlogApiResponse<string>> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await s3Client.send(command);
      
      if (!response.Body) {
        return {
          success: false,
          error: 'File not found or empty',
        };
      }

      // Convert stream to string
      const content = await response.Body.transformToString();
      
      return {
        success: true,
        data: content,
        cacheStatus: 'HIT', // S3 responses are typically cached
      };
    } catch (error) {
      console.error('Error fetching markdown file from S3:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * List all markdown files in the blog prefix
   */
  async listMarkdownFiles(continuationToken?: string): Promise<BlogApiResponse<S3ListResponse>> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: this.blogPrefix,
        ContinuationToken: continuationToken,
        MaxKeys: 100, // Adjust based on your needs
      });

      const response = await s3Client.send(command);
      
      const objects: S3Object[] = (response.Contents || []).map(obj => ({
        Key: obj.Key || '',
        LastModified: obj.LastModified || new Date(),
        ETag: obj.ETag || '',
        Size: obj.Size || 0,
        StorageClass: obj.StorageClass,
      }));

      return {
        success: true,
        data: {
          objects,
          isTruncated: response.IsTruncated || false,
          nextContinuationToken: response.NextContinuationToken,
        },
        cacheStatus: 'HIT',
      };
    } catch (error) {
      console.error('Error listing markdown files from S3:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all markdown files (handles pagination automatically)
   */
  async getAllMarkdownFiles(): Promise<BlogApiResponse<S3Object[]>> {
    try {
      const allObjects: S3Object[] = [];
      let continuationToken: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const response = await this.listMarkdownFiles(continuationToken);
        
        if (!response.success || !response.data) {
          return {
            success: false,
            error: response.error || 'Failed to list files',
          };
        }

        allObjects.push(...response.data.objects);
        hasMore = response.data.isTruncated;
        continuationToken = response.data.nextContinuationToken;
      }

      return {
        success: true,
        data: allObjects,
        cacheStatus: 'HIT',
      };
    } catch (error) {
      console.error('Error getting all markdown files from S3:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get markdown file by slug
   */
  async getMarkdownFileBySlug(slug: string): Promise<BlogApiResponse<string>> {
    const key = `${this.blogPrefix}${slug}.md`;
    return this.getMarkdownFile(key);
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error checking if file exists in S3:', error);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string): Promise<BlogApiResponse<{
    lastModified: Date;
    size: number;
    etag: string;
  }>> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await s3Client.send(command);
      
      return {
        success: true,
        data: {
          lastModified: response.LastModified || new Date(),
          size: response.ContentLength || 0,
          etag: response.ETag || '',
        },
        cacheStatus: 'HIT',
      };
    } catch (error) {
      console.error('Error getting file metadata from S3:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
export const s3Service = new S3Service();
