# 📊 Project Manager - Task Management Web App

A full-stack web application for project management with role-based access control, built with **React**, **Node.js**, **Express**, and **PostgreSQL**.

## ✨ Features

- 🔐 **Authentication**: Secure signup/login with JWT tokens
- 📁 **Project Management**: Create, edit, and manage projects
- 👥 **Team Management**: Add/remove team members with role-based access (Admin/Member)
- 📋 **Task Management**: Create, assign, and track tasks with status and priority
- 📊 **Dashboard**: Real-time overview of projects, tasks, and progress
- 🎯 **Task Tracking**: Monitor task status, deadlines, and overdue items
- 🔒 **Role-Based Access Control**: Admin and Member roles with different permissions
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with proper validation
- PostgreSQL database with relational data model
- JWT-based authentication
- Role-based access control middleware
- Comprehensive error handling

### Frontend (React + TypeScript)
- Modern React with Hooks
- TypeScript for type safety
- React Router for navigation
- Axios for API calls
- Responsive CSS styling
- Context API for state management

### Database (PostgreSQL)
- Users table with role support
- Projects table with team management
- Tasks table with status tracking
- Project members junction table for team access control

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn
- Git

## 🚀 Local Development Setup

### 1. Clone or Extract the Project

```bash
cd Kirat
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your local PostgreSQL credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/project_manager
# JWT_SECRET=your_secret_key
# PORT=5000
# CORS_ORIGIN=http://localhost:3000

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

PostgreSQL will be initialized automatically when the backend server starts. The database schema includes:

- **users**: Stores user accounts with roles (Admin/Member)
- **projects**: Stores project information
- **project_members**: Maps users to projects with their roles
- **tasks**: Stores tasks with status, priority, and assignments

## 🔑 Default Test Credentials

After signup, you can create test accounts:

1. **Admin Account**: Sign up and create projects
2. **Member Account**: Sign up and join projects as a team member

## 📖 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Project Members
- `GET /api/projects/:projectId/members` - List project members
- `POST /api/projects/members/add` - Add member to project
- `DELETE /api/projects/:projectId/members/:userId` - Remove member

### Tasks
- `GET /api/tasks/project/:projectId` - List project tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/assigned` - Get assigned tasks

## 🐳 Docker & Docker Compose

### Run with Docker Compose (Local)

```bash
# Build and start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# PostgreSQL: localhost:5432
```

### Stop services

```bash
docker-compose down
```

## 🚢 Deployment on Railway

Railway is a simple way to deploy full-stack applications. Here's how to deploy this project:

### Prerequisites
1. Create a free account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`

### Step 1: Create a New Project

```bash
railway login
railway init
```

### Step 2: Add PostgreSQL Database

1. Go to Railway dashboard
2. Create a new project
3. Add PostgreSQL service
4. Copy the database connection string

### Step 3: Deploy Backend

1. Create `backend/.env` with Railway database URL
2. Push the project to GitHub
3. In Railway dashboard, add a new service from GitHub
4. Select the backend directory
5. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: 5000
   - `CORS_ORIGIN`: Your frontend URL

### Step 4: Deploy Frontend

1. In Railway dashboard, add another service from GitHub
2. Select the frontend directory
3. Build command: `npm install && npm run build`
4. Start command: `npm run preview`
5. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL (from Railway)

### Step 5: Connect Services

1. Link the frontend to backend by setting `REACT_APP_API_URL` to the backend's Railway URL
2. Railway will automatically manage domains and SSL

### Step 6: Verify Deployment

1. Visit your frontend URL
2. Create an account and test the application
3. Check Railway logs for any errors

### Alternative: Manual Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create a new project
railway init

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

## 🔒 Role-Based Access Control

### Admin Permissions
- Create projects
- Edit/delete projects
- Add/remove team members
- Manage all tasks in their projects
- Assign tasks to members

### Member Permissions
- View assigned projects
- View project tasks
- Create tasks in assigned projects
- Update own tasks
- View team members

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Deployment | Docker, Railway |

## 📁 Project Structure

```
Kirat/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── database/
│   │   ├── utils/
│   │   ├── types/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── railway.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── context/
│   │   └── App.tsx
│   ├── index.html
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── railway.json
├── docker-compose.yml
└── README.md
```

## 🐛 Troubleshooting

### Backend won't connect to database
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `createdb project_manager`

### Frontend can't reach backend
- Check CORS_ORIGIN in backend `.env`
- Verify backend is running on port 5000
- Check network connectivity

### Docker issues
- Make sure Docker daemon is running
- Clear Docker cache: `docker system prune`
- Rebuild images: `docker-compose build --no-cache`

### Railway deployment issues
- Check Railway logs for errors
- Verify environment variables are set correctly
- Ensure PostgreSQL service is running
- Check database connection string format

## 🔐 Security Notes

- Never commit `.env` files
- Always use strong JWT_SECRET in production
- Implement rate limiting for production
- Use HTTPS in production
- Validate all user inputs
- Sanitize database queries
- Implement CSRF protection for forms

## 📊 Performance Tips

1. Add database indexes on foreign keys
2. Implement pagination for large task lists
3. Cache dashboard data
4. Use CDN for static assets
5. Implement lazy loading on frontend
6. Add request throttling

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Task comments and attachments
- [ ] Activity logs
- [ ] Advanced filtering and search
- [ ] Export tasks to CSV/PDF
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Task dependencies and Gantt charts
- [ ] Time tracking
- [ ] Mobile app

## 📝 API Documentation

### Request Headers
All authenticated requests require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Response Format
Success (200):
```json
{ "data": {...} }
```

Error (4xx/5xx):
```json
{ "error": "Error message" }
```

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to GitHub
4. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Railway documentation: https://docs.railway.app
3. Check Express documentation: https://expressjs.com
4. Check React documentation: https://react.dev

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Set strong JWT_SECRET
- [ ] Configure proper DATABASE_URL
- [ ] Enable CORS only for your domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (Sentry)
- [ ] Test all features
- [ ] Set up backups for database
- [ ] Configure auto-scaling if needed

---

**Happy coding! 🚀**

Built with ❤️ for efficient project management.
