import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Blog content types
export interface BlogPost {
  slug: string;
  readingTime: number;
  frontmatter: BlogPostFrontmatter;
  content: MDXRemoteSerializeResult;
  seo: SEO;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BlogMetadata {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: number;
  featuredImage?: string;
  featuredImageAlt?: string;
  isPublished: boolean;
  s3Key: string;
  seo: SEO;
}

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  isPublished: boolean;
  seo: SEO;
}

export interface BlogListResponse {
  posts: BlogMetadata[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface BlogPostResponse {
  post: BlogPost;
  relatedPosts: BlogMetadata[];
}

// S3 related types
export interface S3Object {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass?: string;
}

export interface S3ListResponse {
  objects: S3Object[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

// MDX related types
export interface MDXContent {
  source: string;
  frontmatter: BlogPostFrontmatter;
  readingTime: number;
}

export interface ProcessedMDXContent {
  content: string;
  frontmatter: BlogPostFrontmatter;
  readingTime: number;
  slug: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BlogApiResponse<T = unknown> extends ApiResponse<T> {
  revalidatedAt?: string;
  cacheStatus?: 'HIT' | 'MISS' | 'STALE';
}

// Search and filter types
export interface BlogSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'updatedAt' | 'title' | 'readingTime';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogFilterOptions {
  categories: string[];
  tags: string[];
  authors: string[];
  years: number[];
}
