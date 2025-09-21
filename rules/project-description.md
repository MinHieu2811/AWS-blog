# Project Description

## Tổng quan dự án

**Tên dự án**: Personal Interactive Blog
**Phiên bản**: 1.0.0  
**Mô tả**: An interactive NextJs blog using AWS services  

## Mục tiêu dự án

- Share technical knowledge, especially front-end knowledge
- Build personal credential
- Learn product mindset and grow user research

## Tính năng chính

### ✅ Đã hoàn thành
- [x] Setup Next.js 15 với App Router
- [x] Cấu hình TypeScript
- [x] Setup Tailwind CSS
- [x] Tạo cấu trúc thư mục organized
- [x] Button component với variants
- [x] Utility functions
- [x] Type definitions
- [x] Constants và configuration
- [x] Custom home page

### 🚧 Đang phát triển
- [ ] S3, DynamoDB database integration
- [ ] Logic load markdown content from S3
- [ ] NextJs logic to handle render MDX content
- [ ] Homepage blog listing
- [ ] Detail page blog render from MDX by ISR 
 
### 📋 Kế hoạch tương lai
- [ ] Mobile responsive optimization
- [ ] CI/CD pipeline
- [ ] Performance optimization

## Công nghệ sử dụng

### Frontend
- **Next.js 15**: React framework với App Router
- **TypeScript**: Type safety và better DX
- **Tailwind CSS**: Utility-first CSS framework
- **React**: UI library
- **next-mdx-remote**: Handle MDX content
- **remark**: package to handle render MDX 
- **remark-mdx**: package to handle render MDX

- **AWS S3 Storage**: Store .md content files 
- **AWS Amplify**: Hosting website
- **AWS CloudFront**: Serve fast images, media files, and HTML files
- **AWS DynamoDB**: Store content, metadata
- **AWS CloudWatch**: Monitor logs từ Lambda/Amplify, metrics cho DynamoDB/S3, alerts nếu có issue.

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **clsx**: Class name utility
- **tailwind-merge**: Tailwind class merging

## Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Cách chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production server
npm start

# Lint code
npm run lint
```
