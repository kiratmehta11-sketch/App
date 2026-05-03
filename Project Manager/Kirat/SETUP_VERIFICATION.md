# ✅ Setup Verification Guide

Run this after setup to verify everything works!

## Prerequisites Check

- [ ] Node.js v18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] PostgreSQL installed or Docker available
- [ ] Git installed (if cloning from repo)

## Step 1: Backend Setup Verification

```bash
cd backend

# Check Node modules
[ -d "node_modules" ] && echo "✅ node_modules found" || echo "❌ Run: npm install"

# Check .env file
[ -f ".env" ] && echo "✅ .env exists" || echo "❌ Copy .env.example to .env and update"

# Verify TypeScript
npm list typescript

# Build check
npm run build

# Check compiled files
[ -d "dist" ] && echo "✅ dist folder created" || echo "❌ Build failed"
```

## Step 2: Frontend Setup Verification

```bash
cd frontend

# Check Node modules
[ -d "node_modules" ] && echo "✅ node_modules found" || echo "❌ Run: npm install"

# Check Vite config
[ -f "vite.config.ts" ] && echo "✅ vite.config.ts found" || echo "❌ Missing config"

# Build check
npm run build

# Check dist
[ -d "dist" ] && echo "✅ dist folder created" || echo "❌ Build failed"
```

## Step 3: Database Verification

### Option A: PostgreSQL Local

```bash
# Check if PostgreSQL is running
psql --version

# Connect to test database
psql -U postgres -c "SELECT 1"
# Should return: 1
```

### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run -d \
  --name postgres-test \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=project_manager \
  -p 5432:5432 \
  postgres:15-alpine

# Test connection
docker exec postgres-test psql -U user -d project_manager -c "SELECT 1"
```

## Step 4: Backend Runtime Verification

```bash
cd backend

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost:5432/project_manager"
export JWT_SECRET="test_secret_key_12345"
export PORT=5000
export CORS_ORIGIN="http://localhost:3000"

# Try to start server
npm run dev

# You should see:
# ✅ Database initialized successfully
# ✅ Server running on http://localhost:5000
```

## Step 5: Frontend Runtime Verification

```bash
cd frontend

# Start dev server
npm run dev

# You should see:
# ✅ VITE v4.3.9 ready in XXX ms
# ➜  Local: http://localhost:3000/
```

## Step 6: Integration Testing

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
# Response: {"status":"OK"}
```

### Test 2: Database Connection
Open browser to http://localhost:3000 and test:
- [ ] Page loads
- [ ] Can navigate to login page
- [ ] Signup form is visible

### Test 3: Create Account
- [ ] Click Signup
- [ ] Enter name, email, password
- [ ] Click "Sign Up"
- [ ] Should redirect to dashboard

### Test 4: Login
- [ ] Logout
- [ ] Click Login
- [ ] Enter email and password
- [ ] Should see dashboard

### Test 5: Create Project
- [ ] Click "Projects" in navbar
- [ ] Click "+ New Project"
- [ ] Enter project name
- [ ] Click "Create Project"
- [ ] Project should appear in list

### Test 6: Create Task
- [ ] Click on a project
- [ ] Click "+ New Task"
- [ ] Enter task title
- [ ] Click "Create Task"
- [ ] Task should appear in list

### Test 7: Dashboard
- [ ] Click "Dashboard" in navbar
- [ ] Should see stats (Projects, Tasks, etc.)
- [ ] Recent tasks should show

## Step 7: Docker Compose Verification

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# Verify services
[ "$(docker inspect -f '{{.State.Running}}' kirat-backend-1)" = "true" ] && \
  echo "✅ Backend running" || echo "❌ Backend not running"

[ "$(docker inspect -f '{{.State.Running}}' kirat-frontend-1)" = "true" ] && \
  echo "✅ Frontend running" || echo "❌ Frontend not running"

[ "$(docker inspect -f '{{.State.Running}}' kirat-postgres-1)" = "true" ] && \
  echo "✅ PostgreSQL running" || echo "❌ PostgreSQL not running"

# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl -s http://localhost:3000 | grep -q "<!DOCTYPE html" && \
  echo "✅ Frontend responding" || echo "❌ Frontend not responding"
```

## Step 8: API Verification

Create a test script `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"
EMAIL="test@example.com"
PASSWORD="testpass123"

echo "Testing Project Manager API..."

# Signup
echo "1. Testing Signup..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
[ ! -z "$TOKEN" ] && echo "✅ Signup successful" || echo "❌ Signup failed"

# Create Project
echo "2. Testing Create Project..."
RESPONSE=$(curl -s -X POST $BASE_URL/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Project","description":"Test"}')

PROJECT_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
[ ! -z "$PROJECT_ID" ] && echo "✅ Project created" || echo "❌ Project creation failed"

# Create Task
echo "3. Testing Create Task..."
RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"projectId\": $PROJECT_ID,
    \"title\": \"Test Task\",
    \"description\": \"Test\",
    \"priority\": \"High\"
  }")

[ ! -z "$RESPONSE" ] && echo "✅ Task created" || echo "❌ Task creation failed"

# Get Dashboard
echo "4. Testing Dashboard..."
curl -s -X GET $BASE_URL/dashboard \
  -H "Authorization: Bearer $TOKEN" | grep -q "totalTasks" && \
  echo "✅ Dashboard working" || echo "❌ Dashboard failed"

echo "✅ All API tests passed!"
```

Run it:
```bash
chmod +x test_api.sh
./test_api.sh
```

## Troubleshooting Checklist

If something fails:

### Backend Issues
- [ ] Check if PostgreSQL is running
- [ ] Verify DATABASE_URL in .env
- [ ] Check JWT_SECRET is set
- [ ] Review backend logs for errors
- [ ] Verify port 5000 is not in use

### Frontend Issues
- [ ] Check if backend is running
- [ ] Verify CORS is enabled
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Check browser console for errors
- [ ] Verify port 3000 is not in use

### Database Issues
- [ ] Check PostgreSQL is running
- [ ] Verify connection string format
- [ ] Check database exists
- [ ] Verify username/password
- [ ] Check network connectivity

### Docker Issues
- [ ] Verify Docker is running
- [ ] Check container status: `docker ps`
- [ ] View logs: `docker logs <container>`
- [ ] Rebuild images: `docker-compose down && docker-compose build --no-cache`

## Performance Verification

```bash
# Backend response time
time curl http://localhost:5000/api/health

# Frontend page load (with browser DevTools)
# - Should be < 3 seconds
# - Check Network tab for slow resources
```

## Security Verification

- [ ] Frontend doesn't log sensitive data
- [ ] Passwords are hashed in database
- [ ] JWT tokens in localStorage
- [ ] CORS is properly configured
- [ ] Environment variables are in .gitignore
- [ ] No credentials in source code

## Final Checklist

- [ ] Backend running ✅
- [ ] Frontend running ✅
- [ ] Database connected ✅
- [ ] Can signup/login ✅
- [ ] Can create projects ✅
- [ ] Can create tasks ✅
- [ ] Dashboard shows stats ✅
- [ ] All CRUD operations work ✅

## Ready for Deployment?

If all above checks pass, you're ready for:
1. Docker deployment
2. Railway deployment
3. Production setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for next steps!

---

**Status**: When all checks pass ✅, you're production-ready!
