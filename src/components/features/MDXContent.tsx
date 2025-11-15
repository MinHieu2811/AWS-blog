import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { BlogPostFrontmatter } from "@/types";
import { mdxComponents } from "@/components/features/MDXComponents";

interface MDXContentProps {
  source: any;
  frontmatter: BlogPostFrontmatter;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <>
      <MDXRemote
        source={source}
        components={mdxComponents as MDXRemoteProps["components"]}
      />
    </>
  );
}
