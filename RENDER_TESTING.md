# Render Deployment Testing Guide

## After deploying to Render, test these endpoints:

### 1. Health Check (should work immediately)
```
GET https://cf-backend.onrender.com/api/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-07-18T...",
  "environment": "production"
}
```

### 2. Test Neon Database Connection
The health endpoint above tests DB connection automatically.

### 3. Test Frontend Connection
1. Update Netlify environment variable:
   - `REACT_APP_API_URL=https://cf-backend.onrender.com/api`
2. Redeploy Netlify site
3. Check browser console for API connection

## 🚨 Important Render Notes:

### Free Tier Limitations:
- **Sleeps after 15 minutes** of inactivity
- **750 hours/month** (about 31 days worth)
- **First request after sleep takes 30-60 seconds** to wake up
- No persistent disk storage (use Neon for all data)

### Advantages:
- ✅ **100% FREE** for this project size
- ✅ **Excellent** Neon PostgreSQL integration
- ✅ **Auto-deploys** from GitHub
- ✅ **Built-in** SSL certificates
- ✅ **Simple** environment variable management

### Alternative FREE Options:

#### Option 2: Vercel (Serverless)
- Convert Express routes to serverless functions
- 100GB bandwidth/month
- No cold start delays
- Perfect for this project size

#### Option 3: Fly.io
- 3 shared-cpu-1x machines free
- 3GB persistent volume
- Good for small apps

## Testing Steps:

1. **Deploy to Render** following DEPLOYMENT.md
2. **Wait 2-3 minutes** for initial deployment
3. **Test health endpoint** (may take 30 seconds first time)
4. **Update Netlify** with Render URL
5. **Test full integration** from frontend

## Troubleshooting:

**If health endpoint fails:**
- Check Render logs (Dashboard → Service → Logs)
- Verify environment variables are set
- Ensure DATABASE_URL is correct

**If frontend can't connect:**
- Check CORS settings in backend
- Verify REACT_APP_API_URL in Netlify
- Check browser console for errors
