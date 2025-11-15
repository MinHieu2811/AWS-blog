import Link from 'next/link';
import { Metadata } from 'next';
import { blogService } from '@/services/blogService';
import { formatDate } from '@/lib/utils';
import { BlogMetadata } from '@/types';

export const metadata: Metadata = {
  title: 'Blog - Personal Interactive Blog',
  description: 'Technical knowledge sharing, especially front-end development insights and best practices.',
  openGraph: {
    title: 'Blog - Personal Interactive Blog',
    description: 'Technical knowledge sharing, especially front-end development insights and best practices.',
    type: 'website',
  },
};

interface BlogCardProps {
  post: BlogMetadata;
}

function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="card">
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag">
            {post.category}
          </span>
          <span className="text-text-muted text-sm">
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="text-xl font-semibold text-text-primary mb-2 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-accent-primary transition-colors"
          >
            {post.title}
          </Link>
        </h1>

        <p className="text-text-secondary mb-4 line-clamp-3">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-background-secondary text-text-secondary px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-text-muted text-xs">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>By {post.author}</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const response = await blogService.getAllBlogPosts();

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Error Loading Blog Posts
          </h1>
          <p className="text-text-secondary">
            {response.error || 'Unable to load blog posts at this time.'}
          </p>
        </div>
      </div>
    );
  }

  const { posts } = response.data;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Personal Interactive Blog
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Sharing technical knowledge, especially front-end development insights and best practices. 
            Building personal credentials and growing user research.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              {posts.length}
            </div>
            <div className="text-text-secondary">Total Posts</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              {new Set(posts.map(p => p.category)).size}
            </div>
            <div className="text-text-secondary">Categories</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              {new Set(posts.flatMap(p => p.tags)).size}
            </div>
            <div className="text-text-secondary">Tags</div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-text-primary mb-4">
              No Blog Posts Yet
            </h1>
            <p className="text-text-secondary">
              Check back soon for new content!
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-text-muted">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
}
