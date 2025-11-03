import { s3Config } from '@/lib/aws-config';
import { s3Service } from './s3Service';
import { 
  processAndSerializeMDX, 
  extractSlugFromS3Key, 
  generateS3KeyFromSlug,
} from '@/lib/mdx-utils';
import { 
  BlogPost, 
  BlogMetadata, 
  BlogPostResponse, 
  BlogListResponse,
  BlogApiResponse 
} from '@/types';

export class BlogService {
  /**
   * Get a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogApiResponse<BlogPostResponse>> {
    try {
      const contentResponse = await s3Service.getMarkdownFileBySlug(slug, 'mdx');

      if (!contentResponse.success || !contentResponse.data) {
        return {
          success: false,
          error: contentResponse.error || 'Blog post not found',
        };
      }

      // Process and serialize MDX content
      const { mdxSource, frontmatter, readingTime, headings } = await processAndSerializeMDX(
        contentResponse.data,
        slug
      );
      console.log('headings', headings);

      // Create blog post object
      const blogPost: BlogPost = {
        slug,
        readingTime,
        frontmatter: frontmatter,
        content: mdxSource,
        seo: frontmatter?.seo,
        headings,
      };

      const relatedPosts: BlogMetadata[] = [];

      return {
        success: true,
        data: {
          post: blogPost,
          relatedPosts,
        },
        revalidatedAt: new Date().toISOString(),
        cacheStatus: contentResponse.cacheStatus,
      };
    } catch (error) {
      console.error('Error getting blog post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all blog posts metadata
   */
  async getAllBlogPosts(): Promise<BlogApiResponse<BlogListResponse>> {
    try {
      const filesResponse = await s3Service.getAllMarkdownFiles();

      if (!filesResponse.success || !filesResponse.data) {
        return {
          success: false,
          error: filesResponse.error || 'Failed to fetch blog posts',
        };
      }

      // Process each file to extract metadata
      const posts: BlogMetadata[] = [];
      
      for (const file of filesResponse.data) {
        try {
          // Get file content
          const contentResponse = await s3Service.getMarkdownFile(file.Key);
          
          if (contentResponse.success && contentResponse.data) {
            // Process content to get frontmatter
            const { processMarkdownContent } = await import('@/lib/mdx-utils');
            const slug = extractSlugFromS3Key(file.Key, s3Config.blogPrefix);
            const processed = await processMarkdownContent(contentResponse.data, slug);

            // Only include published posts
            if (processed.frontmatter.isPublished) {
              const blogMetadata: BlogMetadata = {
                slug,
                title: processed.frontmatter?.title,
                description: processed.frontmatter?.description,
                publishedAt: processed.frontmatter.publishedAt,
                updatedAt: processed.frontmatter?.updatedAt || processed.frontmatter?.publishedAt,
                author: processed.frontmatter.author,
                tags: processed.frontmatter?.tags,
                category: processed.frontmatter?.category,
                readingTime: processed.readingTime,
                featuredImage: processed.frontmatter?.featuredImage,
                featuredImageAlt: processed.frontmatter?.featuredImageAlt,
                isPublished: processed.frontmatter?.isPublished,
                s3Key: file.Key,
                seo: processed.frontmatter.seo,
                headings: processed.headings,
              };

              posts.push(blogMetadata);
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file.Key}:`, error);
          // Continue processing other files
        }
      }

      // Sort posts by published date (newest first)
      posts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      return {
        success: true,
        data: {
          posts,
          totalCount: posts.length,
          hasMore: false, // For now, we're not implementing pagination
        },
        revalidatedAt: new Date().toISOString(),
        cacheStatus: filesResponse.cacheStatus,
      };
    } catch (error) {
      console.error('Error getting all blog posts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get blog posts by category
   */
  async getBlogPostsByCategory(category: string): Promise<BlogApiResponse<BlogListResponse>> {
    try {
      const allPostsResponse = await this.getAllBlogPosts();

      if (!allPostsResponse.success || !allPostsResponse.data) {
        return allPostsResponse;
      }

      const filteredPosts = allPostsResponse.data.posts.filter(
        post => post.category.toLowerCase() === category.toLowerCase()
      );

      return {
        success: true,
        data: {
          posts: filteredPosts,
          totalCount: filteredPosts.length,
          hasMore: false,
        },
        revalidatedAt: new Date().toISOString(),
        cacheStatus: allPostsResponse.cacheStatus,
      };
    } catch (error) {
      console.error('Error getting blog posts by category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get blog posts by tag
   */
  async getBlogPostsByTag(tag: string): Promise<BlogApiResponse<BlogListResponse>> {
    try {
      const allPostsResponse = await this.getAllBlogPosts();

      if (!allPostsResponse.success || !allPostsResponse.data) {
        return allPostsResponse;
      }

      const filteredPosts = allPostsResponse.data.posts.filter(
        post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );

      return {
        success: true,
        data: {
          posts: filteredPosts,
          totalCount: filteredPosts.length,
          hasMore: false,
        },
        revalidatedAt: new Date().toISOString(),
        cacheStatus: allPostsResponse.cacheStatus,
      };
    } catch (error) {
      console.error('Error getting blog posts by tag:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search blog posts
   */
  async searchBlogPosts(query: string): Promise<BlogApiResponse<BlogListResponse>> {
    try {
      const allPostsResponse = await this.getAllBlogPosts();

      if (!allPostsResponse.success || !allPostsResponse.data) {
        return allPostsResponse;
      }

      const searchQuery = query.toLowerCase();
      const filteredPosts = allPostsResponse.data.posts.filter(
        post => 
          post.title.toLowerCase().includes(searchQuery) ||
          post.description.toLowerCase().includes(searchQuery) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
          post.author.toLowerCase().includes(searchQuery)
      );

      return {
        success: true,
        data: {
          posts: filteredPosts,
          totalCount: filteredPosts.length,
          hasMore: false,
        },
        revalidatedAt: new Date().toISOString(),
        cacheStatus: allPostsResponse.cacheStatus,
      };
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Check if a blog post exists
   */
  async blogPostExists(slug: string): Promise<boolean> {
    try {
      const s3Key = generateS3KeyFromSlug(slug, s3Config.blogPrefix);
      return await s3Service.fileExists(s3Key);
    } catch (error) {
      console.error('Error checking if blog post exists:', error);
      return false;
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();
