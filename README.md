# Personal AWS Blog

This repository contains a Next.js 15 blog that renders Markdown/MDX content sourced from Amazon S3 and metadata stored in DynamoDB. The application is deployed on **AWS Amplify Hosting**, which runs the Next.js server (including SSR/ISR) and manages the underlying CloudFront distribution. All code continues to follow the conventions documented in `rules/`.

## High-Level Architecture

1. **Build**  
   - `npm run build` produces the `.next/` output consumed by Amplify. Amplify’s build pipeline installs dependencies, lints, and runs `next build`.
2. **Runtime (Amplify)**  
   - Amplify hosts the Next.js server in a managed environment. ISR and API routes are handled entirely by Amplify’s runtime; cached HTML is stored inside Amplify’s platform rather than an external bucket.
   - Amplify automatically provisions CloudFront and an S3 bucket for static assets; you can optionally place an additional CloudFront distribution in front if you need custom caching rules.
3. **Data**  
   - **S3 (content bucket)**: stores MDX files under `mdx/posts/<slug>/content.mdx` plus optional media.
   - **S3 (media bucket)**: optional dedicated bucket for uploads (images, attachments).
   - **DynamoDB**: stores blog metadata, search indexes, and any dynamic attributes referenced by the site.
4. **Observability**  
   - Amplify streams logs to CloudWatch automatically. You can forward logs to S3/Athena if deeper analytics are required.

## S3 Layout

```
s3://<content-bucket>/
  mdx/posts/<slug>/content.mdx
  mdx/posts/<slug>/images/...

s3://<media-bucket>/            # optional
  uploads/<yyyy>/<mm>/<file>
```

- Amplify uses its own hidden bucket for compiled assets; the buckets above are for authoring content and media only.

## Build Workflow (local or CI)

```bash
npm ci
npm run lint
npm run build
```

- Amplify build manifests mirror these steps (see `buildspec.yml` for the reference pipeline).
- No manual packaging of Lambda bundles is required—the default Amplify framework supports SSR/ISR out of the box.

## Infrastructure Template

- `template.yaml` now provisions only the shared data resources (S3 buckets and DynamoDB table) needed by the application. Amplify handles the hosting layer.
- Parameters let you decide whether to create buckets/tables or reuse existing ones.

## IAM Guidelines

- **Amplify service role** should allow:
  - `s3:GetObject` on the MDX content bucket/prefix.
  - `s3:PutObject` (if uploads happen through Amplify) on the media bucket.
  - `dynamodb:GetItem`, `Query`, `UpdateItem`, and `Scan` on the blog metadata table.
- **Content management role** (for CMS/API) should have write access to the same resources.
  - See `aws/IAM_role/lambda-inline-policy.json` and `aws/IAM_user/deploy-policy.json` for sample policy scaffolding—update ARNs to match your buckets/tables.

## Environment Variables

Amplify build and runtime should supply:

- `AWS_REGION`
- `S3_SOURCE_BUCKET_NAME` and `S3_SOURCE_PREFIX` (default `mdx/posts/`)
- `S3_MEDIA_BUCKET_NAME` (if using a separate media bucket)
- `NEXT_PUBLIC_API_TRACKING` (base URL for the tracking API, exposed to the browser)
- `DYNAMODB_TABLE_NAME`
- `DYNAMODB_REGION` (optional, defaults to `AWS_REGION`)

Ensure these are configured under Amplify’s build & runtime environment settings.

## Local Development

- `npm run dev` launches the Next.js development server with ISR disabled (local fallback).  
- MDX processing lives in `src/lib/mdx-utils.ts`; S3/Dynamo clients are in `src/services`.  
- Sample files for testing are in `sample-content/`.

## Deployment Checklist

1. Push MDX/asset updates to the content/media buckets (or use a CMS that writes to S3).  
2. Commit code changes; Amplify automatically triggers the build (`npm ci`, `npm run lint`, `npm run build`).  
3. Confirm Amplify deploy succeeded and verify ISR by visiting the updated pages.  
4. If you need immediate cache flush, use Amplify’s “Invalidate cache” or the CloudFront invalidation console.  
5. Monitor logs in Amplify Console or CloudWatch for errors and performance metrics.

## Additional Resources

- `buildspec.yml`: reference build spec mirroring the Amplify build steps.  
- `template.yaml`: optional CloudFormation snippet to provision shared S3/Dynamo resources.  
- `aws/DynamoDB/iam.json`: sample DynamoDB permissions for back-end services.  
- `rules/`: project-specific coding and architecture standards.
