'use client';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { BlogPostFrontmatter } from '@/types';
import { mdxComponents } from '@/components/features/MDXComponents';

interface MDXContentProps {
  source: any;
  frontmatter: BlogPostFrontmatter;
}

export function MDXContent({ source, frontmatter }: MDXContentProps) {
  return (
    <MDXRemote
      {...source}
      frontmatter={frontmatter}
      components={mdxComponents as MDXRemoteProps['components']}
    />
  );
}
