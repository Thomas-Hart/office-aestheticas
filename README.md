# Office Aestheticas Ecommerce Platform

**Live demo:** https://aestheticas.com

## Overview

Office Aestheticas is a fully‑featured ecommerce store built for any number of products and complex variants. With Nuxt 3 SSR, it achieves Google Lighthouse scores of 100 across all metrics and ~1 s load times. Key features include product pages with filtering, reviews, optimized cart/checkout UI, responsive design, email & Google login, user profiles (orders, wishlists, support tickets), PayPal & Square payments, Klaviyo & Meta Pixel/Conversions API for marketing, and an admin console for managing blogs, products, users, orders, reviews, tickets, bundles, and affiliates.

## Tech Stack

- Frontend: Nuxt 3 (Vue 3 SSR), Pinia  
- Backend & API: Node.js, Nuxt Server Routes, Mongoose, MongoDB Atlas  
- Storage: AWS S3 via @aws-sdk/client‑s3  
- Payments: PayPal JS SDK, Square SDK  
- Marketing: Klaviyo API, Meta Pixel & Conversions API  
- Auth & Security: JWT, bcrypt, Google OAuth, reCAPTCHA v3  
- DevOps: Vercel (CI/CD), GitHub  

## Key Features

- SSR for speed & SEO  
- Modular, auto‑imported components  
- Complex variant handling & filtering  
- Reviews, ratings & charts (Chart.js)  
- Optimized cart & checkout UI  
- Responsive, WCAG‑compliant design  
- Email/password & Google Sign‑In  
- User profiles: orders, wishlists, support tickets  
- PayPal & Square Payment methods  
- Klaviyo waitlist & email flows  
- Meta Pixel & Conversions API tracking  
- Admin console for:
    - Blogs (CRUD)
    - Products & variants
    - User management
    - Order & fulfillment
    - Review moderation
    - Support tickets
    - Bundles & affiliates
- 100 Lighthouse scores, ~1 s load times

## Getting Started

### Prerequisites

- Node.js v16 or higher  
- npm, yarn, or pnpm  
- MongoDB Atlas account  
- AWS account & S3 bucket  
- PayPal & Square credentials  
- Google OAuth credentials  
- Klaviyo account  
- Meta Pixel & Conversions API credentials  

### Installation & Running Locally

    git clone https://github.com/hartecho/office-aestheticas.git
    cd office-aestheticas
    npm install

### Environment Variables

    DB_URI=your_mongodb_connection_string
    S3_BUCKET=your_s3_bucket_name
    AWS_ACCESS_KEY=your_aws_access_key
    AWS_SECRET_KEY=your_aws_secret_key
    AWS_REGION=your_aws_region
    SQUARE_LOCATION_ID=your_square_location_id
    SQUARE_APP_ID=your_square_application_id
    SQUARE_ACCESS_TOKEN=your_square_access_token
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_oauth_client_id
    GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
    KLAVIYO_PUBLIC_KEY=your_klaviyo_public_key
    KLAVIYO_PRIVATE_KEY=your_klaviyo_private_key
    KLAVIYO_WAITLIST_ID=your_klaviyo_waitlist_list_id
    META_PIXEL_ID=your_meta_pixel_id
    META_ACCESS_TOKEN=your_meta_conversions_api_access_token

### Local Development

    npm run dev

### Build & Production

    npm run build
    npm run start

## Deployment

Connected to Vercel: pushes to `main` auto‑deploy to https://aestheticas.com

## License

© 2025 HARTECHO LLC. All rights reserved.

## Contact

Thomas Hart  
Email: thomas@hartecho.com  
