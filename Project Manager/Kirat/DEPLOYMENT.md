# 🚀 Railway Deployment Guide

## Quick Start

This guide will help you deploy the Project Manager app on Railway.

## Prerequisites

- Railway account (free at https://railway.app)
- GitHub account with this repo
- Project pushed to GitHub

## Step-by-Step Deployment

### 1. Create Railway Account & Project

1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project
4. Select "Deploy from GitHub"
5. Choose this repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "PostgreSQL"
3. Railway will add the database automatically
4. Note the `DATABASE_URL` (Railway provides this automatically)

### 3. Configure Backend Service

1. Click "+ New" and select "GitHub Repo"
2. Choose the backend folder
3. Set the root directory to `backend/`
4. Configure environment variables:

```
DATABASE_URL=<auto-populated by Railway>
JWT_SECRET=your_super_secret_key_change_in_production_12345
PORT=5000
CORS_ORIGIN=${{ RAILWAY_FRONTEND_URL }}
NODE_ENV=production
```

5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`

### 4. Configure Frontend Service

1. Click "+ New" and select "GitHub Repo"
2. Choose the frontend folder
3. Set the root directory to `frontend/`
4. Configure environment variables:

```
VITE_API_URL=${{ RAILWAY_BACKEND_URL }}/api
```

5. Set build command: `npm install && npm run build`
6. Set start command: `npm run preview`
7. Set port to 3000

### 5. Link Services

1. In the backend service, go to "Variables"
2. Add: `CORS_ORIGIN=<your-frontend-url>`
3. In the frontend service, add the backend URL

### 6. Verify Deployment

1. Wait for all services to deploy (green status)
2. Click the frontend service URL
3. Test signup/login
4. Create a project and tasks

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=secure_random_string_at_least_32_chars_long
PORT=5000
CORS_ORIGIN=https://your-frontend.railway.app
NODE_ENV=production
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend.railway.app/api
```

## Deploy from CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Monitor Logs

```bash
# View backend logs
railway logs --service backend

# View frontend logs
railway logs --service frontend

# View database logs
railway logs --service postgres
```

## Update Deployment

```bash
# Make changes locally
git add .
git commit -m "Update"
git push

# Railway auto-deploys from GitHub
# Or manually trigger:
railway trigger
```

## Database Migrations

The database schema is created automatically when the backend starts. To manually access:

```bash
# Connect to PostgreSQL on Railway
railway connect postgres
```

## Debugging

### Check service status
```bash
railway status
```

### View real-time logs
```bash
railway logs -f
```

### Run commands in service
```bash
railway run npm run build
```

## Costs

Railway provides:
- 500 hours of compute monthly (free tier)
- $5 credit for PostgreSQL usage
- Perfect for small projects

## Scaling

### Increase memory/CPU
1. Go to service settings
2. Adjust resource allocation
3. Railway handles automatic scaling

### Backup database
1. Go to PostgreSQL service
2. Download backup
3. Or set up automated backups

## Troubleshooting

### Service won't start
- Check logs: `railway logs`
- Verify build command works locally
- Check PORT environment variable

### Database connection fails
- Verify DATABASE_URL is set
- Check PostgreSQL service is running
- Test connection locally first

### Frontend can't reach backend
- Verify CORS_ORIGIN is set correctly
- Check VITE_API_URL in frontend
- Test backend health: curl https://your-backend/api/health

### Build fails
- Run `npm run build` locally to debug
- Check Node version compatibility
- Clear dependencies: `rm -rf node_modules package-lock.json`

## Performance Tips

1. Use Railway's auto-scaling
2. Enable caching for static assets
3. Monitor resource usage in dashboard
4. Set up alerts for high resource use
5. Optimize database queries

## Security

1. Never commit .env files
2. Use strong JWT_SECRET (32+ chars)
3. Enable HTTPS (Railway default)
4. Configure CORS properly
5. Use environment variables for secrets
6. Implement rate limiting (recommended)

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure auto-scaling
3. Set up monitoring and alerts
4. Enable automated backups
5. Document deployment process

## Support

- Railway Docs: https://docs.railway.app
- Railway Community: https://discord.gg/railway
- Project Issues: Check GitHub issues

---

Happy deploying! 🎉
