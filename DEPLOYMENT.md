# Deployment Guide

This project contains:
- backend: Node.js + Express + MongoDB
- frontend: React + Vite

## 1) Prepare Environment Files

Backend:
1. Copy backend/.env.example to backend/.env
2. Set production values:
   - MONGO_URI
   - JWT_SECRET
   - CORS_ORIGIN (comma-separated allowed frontend URLs)
   - PORT (optional)

Frontend:
1. Copy frontend/.env.example to frontend/.env
2. Set:
   - VITE_API_URL to your deployed backend URL (for example, https://api.yourdomain.com)

## 2) Local Verification Before Deploy

Backend:
1. cd backend
2. npm install
3. npm run seed
4. npm start

Frontend:
1. cd frontend
2. npm install
3. npm run build
4. npm run test

## 3) Suggested Deployment Targets

Backend:
- Render, Railway, or any Node host
- Start command: npm start

Frontend:
- Vercel, Netlify, or Cloudflare Pages
- Build command: npm run build
- Publish directory: dist

## 4) Post-Deploy Smoke Tests

1. GET <backend-url>/health should return status OK.
2. POST <backend-url>/api/auth/login with admin credentials should return a token.
3. Open frontend URL and verify:
   - events list loads
   - admin login works
   - create event works

## 5) Security Checklist

1. Use a strong JWT_SECRET.
2. Do not commit .env files.
3. Restrict CORS_ORIGIN to trusted frontend domains.
4. Change default admin password after first deployment.
