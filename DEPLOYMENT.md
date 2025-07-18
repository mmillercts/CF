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
- **Render** (Recommended - FREE tier with excellent Neon integration)
- **Vercel** (FREE serverless functions)
- **Fly.io** (FREE tier available)
- DigitalOcean App Platform
- Or any Node.js hosting service

## 🚀 **Complete Deployment Process**

### **Step 1: Deploy Backend to Render (FREE)**
1. **Sign up**: Create account at https://render.com
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**: Choose `mmillercts/CF`
4. **Configure service**:
   - Name: `cf-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Auto-Deploy: Yes

5. **Environment Variables** (in Render dashboard):
   ```
   DATABASE_URL=your-neon-connection-string-from-backend-env
   JWT_SECRET=your-jwt-secret-from-backend-env
   COOKIE_SECRET=your-cookie-secret-from-backend-env
   FRONTEND_URL=https://your-netlify-site.netlify.app
   NODE_ENV=production
   PORT=10000
   ```

6. **Deploy**: Render will automatically build and deploy (FREE tier includes 750 hours/month)

### **Step 2: Update Frontend (Netlify)**
1. **Get Render URL**: Copy your Render app URL (e.g., `https://cf-backend.onrender.com`)
2. **Update Netlify**: Go to Site Settings → Environment Variables
3. **Set API URL**:
   ```
   REACT_APP_API_URL=https://cf-backend.onrender.com/api
   ```
4. **Redeploy**: Trigger new build in Netlify

### **Step 3: Test Integration**
- Frontend: `https://your-site.netlify.app`
- Backend API: `https://cf-backend.onrender.com/api/health`
- Database: Automatically connected to Neon

## 🔗 **CRUD Operations Ready**

Your backend includes full CRUD for:
- **Home Content** - Welcome messages, announcements, quick links
- **About Content** - Company information
- **Team Members** - Employee profiles
- **Benefits** - Employee benefits by category  
- **Documents** - File management with categories
- **Photos** - Gallery with categorized images
- **Calendar Events** - Event management
- **User Management** - Authentication & roles

## 📋 **API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info

### Content Management (requires auth)
- `GET/POST/PUT/DELETE /api/home` - Home content
- `GET/POST/PUT/DELETE /api/about` - About content
- `GET/POST/PUT/DELETE /api/team` - Team members
- `GET/POST/PUT/DELETE /api/benefits` - Benefits
- `GET/POST/PUT/DELETE /api/documents` - Documents  
- `GET/POST/PUT/DELETE /api/photos` - Photos
- `GET/POST/PUT/DELETE /api/calendar` - Events

### Health Check
- `GET /api/health` - Service status + DB connection

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
