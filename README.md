# DevLog AI

Turn messy developer notes into polished LinkedIn posts using AI.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React, Vite, Tailwind CSS, Axios, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | OpenAI API |
| Auth | JWT + LinkedIn OAuth |

## Project Structure

```
devlog/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       └── layouts/
├── server/          # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── config/
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [OpenAI API key](https://platform.openai.com/api-keys)
- [LinkedIn Developer App](https://www.linkedin.com/developers/)

## Setup

### 1. Clone & install

```bash
cd devlog

# Backend
cd server
npm install
cp .env.example .env

# Frontend
cd ../client
npm install
cp .env.example .env
```

### 2. Configure environment variables

**server/.env**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devlog-ai
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/linkedin/callback
CLIENT_URL=http://localhost:5173
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. LinkedIn Developer App Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/) and create an app.
2. Under **Auth** tab, add redirect URL:
   ```
   http://localhost:5000/api/linkedin/callback
   ```
3. Under **Products**, request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn** (for `w_member_social` scope)
4. Copy **Client ID** and **Client Secret** into `server/.env`.

### 4. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 5. Run the app

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Usage Flow

1. **Register** an account on DevLog AI
2. **Connect LinkedIn** from the dashboard
3. Write rough notes: *"learned arrays closures built todo app"*
4. Select a tone: Professional, Sarcastic, or Tired Developer
5. Click **Generate Post** — AI creates a polished LinkedIn post
6. Preview the result and click **Post To LinkedIn**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/posts/generate` | Generate AI post |
| GET | `/api/posts` | Get user's posts |
| GET | `/api/posts/stats` | Get user stats |
| GET | `/api/linkedin/auth-url` | Get LinkedIn OAuth URL |
| GET | `/api/linkedin/callback` | LinkedIn OAuth callback |
| POST | `/api/linkedin/post` | Post to LinkedIn |
| GET | `/api/linkedin/profile` | LinkedIn connection status |

## Deployment

### Backend (Railway / Render / Fly.io)

1. Set all environment variables from `server/.env.example`
2. Update `LINKEDIN_REDIRECT_URI` to your production callback URL
3. Update `CLIENT_URL` to your frontend URL
4. Use MongoDB Atlas for production database
5. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your production API URL
2. Build command: `npm run build`
3. Output directory: `dist`

### Production checklist

- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS on both frontend and backend
- [ ] Update LinkedIn redirect URI to production URL
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Set `NODE_ENV=production`

## License

MIT
