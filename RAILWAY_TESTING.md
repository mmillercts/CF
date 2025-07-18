## Testing Your Railway Backend

### 1. Health Check
Visit: `https://your-app.railway.app/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Chick-fil-A Employee Portal API is running",
  "timestamp": "2025-07-18T...",
  "environment": "production",
  "database": {
    "status": "connected",
    "time": "2025-07-18T..."
  }
}
```

### 2. Database Connection
The health endpoint shows database status. If connected, your tables are automatically created.

### 3. CORS Test
Your frontend should be able to connect to the backend once you update the API URL.

## Next Steps After Backend is Live:

1. **Copy your Railway URL** (e.g., `https://cf-production-abc123.up.railway.app`)

2. **Update Netlify Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Update `REACT_APP_API_URL` to `https://your-railway-url.railway.app/api`
   - Trigger a new deploy

3. **Update Railway FRONTEND_URL**:
   - Go to Railway Variables
   - Update `FRONTEND_URL` to your Netlify URL

4. **Test Full Integration**:
   - Frontend: Your Netlify site
   - Backend API: Your Railway API
   - Database: Neon PostgreSQL

## Troubleshooting:

**Build Fails?**
- Check Railway logs in Deployments tab
- Verify Root Directory is set to `/backend`
- Ensure all environment variables are set

**Database Connection Fails?**
- Verify DATABASE_URL is exactly from your backend/.env
- Check Neon database is active

**CORS Errors?**
- Verify FRONTEND_URL matches your Netlify domain exactly
- Include https:// in the URL
