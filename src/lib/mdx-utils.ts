import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import matter from 'gray-matter';
import { BlogPostFrontmatter, ProcessedMDXContent, MDXContent } from '@/types';

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} {
  const { data, content: markdownContent } = matter(content);
  
  // Default frontmatter values
  const frontmatter: BlogPostFrontmatter = {
    title: data.title || 'Untitled',
    description: data.description || '',
    publishedAt: data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
    author: data.author || 'Unknown Author',
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || 'General',
    featuredImage: data.featuredImage || undefined,
    featuredImageAlt: data.featuredImageAlt || undefined,
    isPublished: data.isPublished !== false, // Default to true unless explicitly false
    seo: {
      title: data.seo?.title || data.title || 'Untitled',
      description: data.seo?.description || data.description || '',
      keywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords : [],
      canonicalUrl: data.seo?.canonicalUrl || undefined,
    },
  };

  return {
    frontmatter,
    content: markdownContent,
  };
}

/**
 * Process markdown content and prepare for MDX rendering
 */
export async function processMarkdownContent(
  markdownContent: string,
  slug: string
): Promise<ProcessedMDXContent> {
  const { frontmatter, content } = parseFrontmatter(markdownContent);
  const readingTime = calculateReadingTime(content);

  return {
    content,
    frontmatter,
    readingTime,
    slug,
  };
}

/**
 * Serialize markdown content for MDX rendering
 */
export async function serializeMDXContent(content: string) {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm, // GitHub Flavored Markdown
        remarkMdx, // MDX support
      ],
      rehypePlugins: [
        rehypeHighlight, // Syntax highlighting
        rehypeSlug, // Add IDs to headings
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-link'],
              'aria-label': 'Link to this section',
            },
          },
        ],
      ],
    },
  });
}

/**
 * Process and serialize markdown content for rendering
 */
export async function processAndSerializeMDX(
  markdownContent: string,
  slug: string
): Promise<{
  mdxSource: any;
  frontmatter: BlogPostFrontmatter;
  readingTime: number;
}> {
  const processed = await processMarkdownContent(markdownContent, slug);
  const mdxSource = await serializeMDXContent(processed.content);

  return {
    mdxSource,
    frontmatter: processed.frontmatter,
    readingTime: processed.readingTime,
  };
}

/**
 * Extract slug from S3 key
 */
export function extractSlugFromS3Key(key: string, prefix: string): string {
  // Remove prefix and file extension
  const withoutPrefix = key.replace(prefix, '');
  const withoutExtension = withoutPrefix.replace(/\.(md|mdx)$/, '');
  return withoutExtension;
}

/**
 * Generate S3 key from slug
 */
export function generateS3KeyFromSlug(slug: string, prefix: string): string {
  return `${prefix}${slug}.md`;
}

/**
 * Validate frontmatter data
 */
export function validateFrontmatter(data: any): data is BlogPostFrontmatter {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.author === 'string' &&
    Array.isArray(data.tags) &&
    typeof data.category === 'string'
  );
}

/**
 * Sanitize content for SEO
 */
export function sanitizeContentForSEO(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, 160); // Limit to 160 characters for meta description
}

/**
 * Generate table of contents from markdown content
 */
export function generateTableOfContents(content: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}
