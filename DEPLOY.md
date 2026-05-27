# Deploy DevLog AI (Vercel + Railway)

## Architecture

| Part | Host | Folder |
|------|------|--------|
| Frontend | Vercel | `client/` |
| Backend | Railway | `server/` |
| Database | MongoDB Atlas | (already set up) |

---

## Part 1 — Deploy backend on Railway

### Step 1: Create Railway project
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your `devlog` repository
4. Click the new service → **Settings** → **Root Directory** → set to: `server`
5. **Settings** → **Start Command** (should be): `npm start`

### Step 2: Add environment variables
In Railway → your service → **Variables**, add:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://YOUR-RAILWAY-URL/api/linkedin/callback
CLIENT_URL=https://YOUR-VERCEL-URL.vercel.app
```

Replace:
- `YOUR-RAILWAY-URL` → Railway gives you a URL like `https://devlog-ai-production.up.railway.app`
- `YOUR-VERCEL-URL` → your Vercel app URL like `https://devlog-ai.vercel.app`

### Step 3: Get your Railway URL
1. Railway → **Settings** → **Networking** → **Generate Domain**
2. Copy the URL (e.g. `https://devlog-ai-production.up.railway.app`)
3. Update `LINKEDIN_REDIRECT_URI` in Railway variables to:
   ```
   https://devlog-ai-production.up.railway.app/api/linkedin/callback
   ```

### Step 4: Test backend
Open in browser:
```
https://YOUR-RAILWAY-URL/api/health
```
You should see: `{"success":true,"message":"DevLog AI API is running"}`

---

## Part 2 — Update Vercel (frontend)

### Step 1: Environment variable on Vercel
Vercel → your project → **Settings** → **Environment Variables**

Add:
```env
VITE_API_URL=https://YOUR-RAILWAY-URL/api
```

Example:
```env
VITE_API_URL=https://devlog-ai-production.up.railway.app/api
```

### Step 2: Redeploy
Vercel → **Deployments** → **Redeploy** (so the new env var is picked up)

---

## Part 3 — Update LinkedIn app

Go to [linkedin.com/developers](https://www.linkedin.com/developers/) → your app → **Auth**

Add **both** redirect URLs:
```
http://localhost:5000/api/linkedin/callback
https://YOUR-RAILWAY-URL/api/linkedin/callback
```

---

## Part 4 — MongoDB Atlas (production)

1. Atlas → **Network Access** → add `0.0.0.0/0` (allow Railway IPs)
2. Use the **standard** `mongodb://` connection string (not `mongodb+srv`) if you had DNS issues on Windows — Railway usually works with `mongodb+srv` though

---

## Checklist

- [ ] Railway backend deployed, `/api/health` works
- [ ] `VITE_API_URL` on Vercel points to Railway `/api`
- [ ] `CLIENT_URL` on Railway = your Vercel URL (no trailing slash)
- [ ] `LINKEDIN_REDIRECT_URI` on Railway = Railway URL + `/api/linkedin/callback`
- [ ] LinkedIn app has production redirect URL added
- [ ] Redeployed Vercel after env change

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | `CLIENT_URL` on Railway must exactly match Vercel URL |
| LinkedIn redirect fails | Redirect URI in LinkedIn must match `LINKEDIN_REDIRECT_URI` exactly |
| API 404 on Vercel | `VITE_API_URL` must be Railway URL, not Vercel |
| MongoDB fails on Railway | Whitelist `0.0.0.0/0` in Atlas Network Access |
| Generate fails | Check `GEMINI_API_KEY` and `GEMINI_MODEL=gemini-2.5-flash` on Railway |
