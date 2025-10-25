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

### Architecture flow
1. User → CloudFront: Người dùng mở trình duyệt và gửi yêu cầu trang (URL). Yêu cầu tới CloudFront (CDN) đầu tiên.

2. Cache check (CloudFront):

    2a – Cache HIT: Nếu CloudFront có bản cached của trang hoặc asset → trả trực tiếp cho user (tốc độ nhanh, không chạm origin).

    2b – Cache MISS: Nếu không có cache hoặc đã hết hạn → CloudFront sẽ forward request về origin (S3 cho static, hoặc Amplify / Next.js origin cho SSR/ISR).

3. Amplify / Next.js (SSR/ISR) → API: Khi origin cần dữ liệu động (ví dụ trang ISR cần nội dung mới) thì Next.js trên Amplify sẽ gọi CMS API (API Gateway → Lambda) để lấy nội dung.

4. API → DynamoDB: API thực hiện các thao tác CRUD trên DynamoDB để đọc/ghi bài viết, metadata, slug, v.v.

5. API ↔ S3: Media (hình ảnh, file) được lưu trên S3. Thao tác upload thường dùng presigned URL do API trả về; đọc ảnh phục vụ cho trang cũng lấy từ S3 (qua CloudFront).

6. API → CloudWatch: Các hàm Lambda và API ghi log, metric lên CloudWatch để giám sát, cảnh báo (errors, latency, invocations).

7. CloudFront → S3 (Logs): CloudFront có thể lưu access logs vào một bucket S3 (để phân tích hành vi truy cập, nguồn traffic, v.v.).

8. S3 Logs → Athena / Analytics: Dùng Amazon Athena (hoặc Glue + QuickSight) để truy vấn log, làm báo cáo, hoặc xuất sang công cụ analytics khác. Đây là đường đi phân tích logs.

9. Admin (CMS) → API → DB/S3: Khi bạn (Admin) cập nhật nội dung qua CMS admin UI, CMS gọi API để lưu nội dung mới vào DynamoDB hoặc lưu media vào S3.

10. CMS → On-demand Revalidate / Invalidation: Sau khi cập nhật, CMS nên gọi endpoint on-demand revalidate của Next.js (nếu dùng ISR on-demand) hoặc gọi AWS CloudFront invalidation API để xóa cache cũ.

11. Revalidate / Invalidation → CloudFront: CloudFront được làm mới cache; request tiếp theo từ user sẽ nhận nội dung mới (hoặc origin sẽ tái-generate trang và CloudFront sẽ cache lại).

12. CloudWatch → Athena / Dashboards: Ngoài logs, bạn có thể export metrics sang hệ thống phân tích hoặc tạo dashboard/alerts từ CloudWatch.

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
