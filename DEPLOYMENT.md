# Chick-fil-A Employee Portal - Deployment Guide

## Frontend Deployment (Netlify)

This repository is configured to deploy the **frontend only** to Netlify.

### Configuration Files:
- **`netlify.toml`**: Build configuration for Netlify
- **`.netlifyignore`**: Excludes backend files from deployment
- **`.env.production`**: Production environment variables for frontend

### Environment Variables in Netlify:
Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_NAME=Chick-fil-A Employee Portal
REACT_APP_VERSION=1.0.0
```

### Backend Deployment:
The backend in the `/backend` folder should be deployed separately to:
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- Or any Node.js hosting service

### Local Development:
```bash
# Start frontend (port 3000)
npm start

# Start backend (port 5000)
cd backend
npm run dev
```

### Security:
- Database credentials are only in `/backend/.env` (not deployed to Netlify)
- Frontend only knows the backend API URL
- Secrets scanning is disabled for frontend-only deployment
