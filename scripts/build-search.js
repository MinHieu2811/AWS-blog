const fs = require('fs');
const path = require('path');
const { s3Service } = require('../dist/services/s3Service');
const { extractSlugFromS3Key } = require('../dist/lib/mdx-utils');
const { s3Config } = require('../dist/lib/aws-config');
const matter = require('gray-matter');
const { remark } = require('remark');
const strip = require('strip-markdown');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const publicDir = path.join(process.cwd(), 'public');

/**
 * Generates a search index from all blog posts.
 */
async function generateSearchIndex() {
  console.log('Starting search index generation...');

  try {
    // We need to compile the TS files first. A simple approach is to rely
    // on the fact that `next build` compiles them to the .next directory.
    // However, for a standalone script, we should probably transpile them first.
    // Let's assume for now they are available in a `dist` folder.
    // This will be adjusted when updating the build command.
    
    const filesResponse = await s3Service.getAllMarkdownFiles();

    if (!filesResponse.success || !filesResponse.data) {
      console.error('Failed to fetch blog posts from S3:', filesResponse.error);
      process.exit(1);
    }
    
    console.log(`Found ${filesResponse.data.length} files in S3.`);

    const searchIndex = [];

    for (const file of filesResponse.data) {
      if (!file.Key.endsWith('.md')) {
        continue;
      }
      
      try {
        const contentResponse = await s3Service.getMarkdownFile(file.Key);

        if (contentResponse.success && contentResponse.data) {
          const { data: frontmatter, content } = matter(contentResponse.data);

          if (!frontmatter.isPublished) {
            continue;
          }
          
          // Convert markdown content to plain text
          const vfile = await remark().use(strip).process(content);
          const plainTextContent = String(vfile);

          const slug = extractSlugFromS3Key(file.Key, s3Config.sourcePrefix);

          searchIndex.push({
            slug: slug,
            title: frontmatter.title || '',
            description: frontmatter.description || '',
            tags: frontmatter.tags || [],
            content: plainTextContent.replace(/\n/g, ' ').trim(),
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.Key}:`, error);
      }
    }

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(publicDir, 'search-index.json'),
      JSON.stringify(searchIndex, null, 2)
    );

    console.log(`Successfully generated search index with ${searchIndex.length} posts.`);
    console.log('Search index saved to public/search-index.json');

  } catch (error) {
    console.error('An unexpected error occurred during search index generation:', error);
    process.exit(1);
  }
}

// Execute the script
(async () => {
  // A better approach for imports would be to run this script with ts-node
  // or compile the project first. For now, let's just log a warning.
  if (typeof s3Service === 'undefined') {
    console.error('\n[ERROR] Could not import required modules.');
    console.error('This script needs to run after the TypeScript source has been compiled.');
    console.error('Please update your build process.\n');
    process.exit(1);
  }
  await generateSearchIndex();
})();
