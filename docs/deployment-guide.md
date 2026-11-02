# EduSphere Production Deployment & DevOps Guide

## 1. Prerequisites
- **Node.js**: v18+ or v20+ LTS
- **MongoDB**: MongoDB Atlas Cluster URI or local MongoDB instance (Embedded in-memory database runs automatically if no MongoDB instance is provided)
- **Docker**: (Optional for containerized deployments)

---

## 2. Environment Configuration

### Backend Configuration (`server/.env`)
```ini
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/edusphere?retryWrites=true&w=majority
JWT_SECRET=generate_a_random_64_character_hex_string
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=generate_another_random_64_character_hex_string
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=generate_a_secure_cookie_key
CLIENT_URL=https://edusphere.yourdomain.com
RAZORPAY_KEY_ID=rzp_live_your_actual_key
RAZORPAY_KEY_SECRET=your_actual_secret_key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_or_ses_key
SMTP_FROM="EduSphere <no-reply@edusphere.io>"
```

### Frontend Configuration (`client/.env`)
```ini
VITE_API_URL=https://api.edusphere.yourdomain.com/api/v1
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key
```

---

## 3. Deployment with Docker Compose

To spin up the entire platform including MongoDB, Backend, and Frontend Nginx proxy in isolated containers:

```bash
# Build and run all micro-services
docker-compose up --build -d

# Check running container statuses
docker-compose ps

# View unified logs
docker-compose logs -f
```

---

## 4. Production Cloud Deployment (PaaS Architecture)

### Backend (Render / Railway / Fly.io)
1. Link your GitHub repository.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install --omit=dev`
4. Set Start Command: `node server.js`
5. Configure Environment Variables in the platform settings as specified in Section 2.
6. Verify Health Check Endpoint: `GET /api/v1/health`

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Link your GitHub repository.
2. Set Root Directory to `client`.
3. Set Framework Preset: `Vite`
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add Single Page Application (SPA) rewrite rule in `vercel.json` or `_redirects` (`/* /index.html 200`).
7. Configure `VITE_API_URL` to point to your live backend domain.
