import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { blogService } from '@/services/blogService';
import { formatDate } from '@/lib/utils';

// MDX Components for custom rendering
const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-8" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-6" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mb-2" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
  ),
  img: (props: React.HTMLAttributes<HTMLImageElement>) => (
    <img className="max-w-full h-auto rounded-lg mb-4" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="border-gray-300 dark:border-gray-600 my-8" {...props} />
  ),
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const response = await blogService.getAllBlogPosts();
    
    if (!response.success || !response.data) {
      return [];
    }

    return response.data.posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const response = await blogService.getBlogPost(params.slug);
    
    if (!response.success || !response.data) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const { post } = response.data;

    return {
      title: post.seo.title,
      description: post.seo.description,
      keywords: post.seo.keywords,
      authors: [{ name: post?.frontmatter?.author }],
      openGraph: {
        title: post.seo.title,
        description: post.seo.description,
        type: 'article',
        publishedTime: post?.frontmatter?.publishedAt,
        modifiedTime: post?.frontmatter?.updatedAt,
        authors: [post?.frontmatter?.author],
        tags: post?.frontmatter?.tags,
        images: post?.frontmatter?.featuredImage ? [
          {
            url: post?.frontmatter?.featuredImage,
            alt: post?.frontmatter?.featuredImageAlt || post?.frontmatter?.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo.title,
        description: post.seo.description,
        images: post?.frontmatter?.featuredImage ? [post?.frontmatter?.featuredImage] : [],
      },
      alternates: {
        canonical: post.seo.canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

// Main blog post page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const response = await blogService.getBlogPost(params.slug);

  if (!response.success || !response.data) {
    notFound();
  }

  const { post } = response?.data || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post?.frontmatter?.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {post?.frontmatter?.description}
          </p>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>By {post?.frontmatter?.author}</span>
            <span>•</span>
            <time dateTime={post?.frontmatter?.publishedAt}>
              {formatDate(post?.frontmatter?.publishedAt)}
            </time>
            <span>•</span>
            <span>{post?.readingTime} min read</span>
            <span>•</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              {post?.frontmatter?.category}
            </span>
          </div>

          {/* Tags */}
          {post?.frontmatter?.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post?.frontmatter?.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured image */}
          {post?.frontmatter?.featuredImage && (
            <div className="mb-8">
              <img
                src={post?.frontmatter?.featuredImage}
                alt={post?.frontmatter?.featuredImageAlt || post?.frontmatter?.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
          <MDXRemote
            {...post.content}
            frontmatter={post.frontmatter}
            components={MDXComponents}
          />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(post?.frontmatter?.updatedAt || post?.frontmatter?.publishedAt)}
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Share
              </button>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Bookmark
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Enable ISR with revalidation every hour
export const revalidate = 3600;
