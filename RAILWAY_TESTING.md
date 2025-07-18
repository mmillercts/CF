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

---

## Next Steps After Backend is Live

1. **Copy your Railway Backend URL**  
   Example: `https://cf-production-abc123.up.railway.app`

2. **Update Netlify Environment Variables**
   - Go to **Netlify Dashboard → Site Settings → Environment Variables**
   - Set or update `REACT_APP_API_URL` to:  
     `https://your-railway-url.railway.app/api`
   - Save changes and **trigger a new deploy**

3. **Update Railway FRONTEND_URL**
   - Go to **Railway Variables**
   - Set or update `FRONTEND_URL` to your Netlify site URL (must include `https://`)

4. **Test Full Integration**
   - **Frontend:** Your Netlify site
   - **Backend API:** Your Railway API
   - **Database:** Neon PostgreSQL

---

## Troubleshooting

### Build Fails?
- Check Railway logs in the Deployments tab for errors
- Verify the Root Directory is set to `/backend` in Railway project settings
- Ensure all required environment variables are set in both Railway and Netlify

### Database Connection Fails?
- Verify `DATABASE_URL` in Railway matches the value from your backend/.env
- Check that your Neon database is active and accessible

### CORS Errors?
- Ensure `FRONTEND_URL` in Railway matches your Netlify domain **exactly** (including `https://`)
- Double-check for typos or missing protocol in URLs

---

**Tip:** After any environment variable change, always redeploy your site and/or backend to apply updates.
