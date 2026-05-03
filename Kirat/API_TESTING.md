# 🧪 API Testing Guide

## Using cURL or Postman

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://your-app.railway.app/api`

## Authentication Endpoints

### 1. Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Project Endpoints

### 1. Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### 2. List Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>"
```

### 3. Get Project Details
```bash
curl -X GET http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer <token>"
```

### 4. Update Project
```bash
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

### 5. Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer <token>"
```

## Team Member Endpoints

### 1. Add Member to Project
```bash
curl -X POST http://localhost:5000/api/projects/members/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "projectId": 1,
    "userId": 2,
    "role": "Member"
  }'
```

### 2. List Project Members
```bash
curl -X GET http://localhost:5000/api/projects/1/members \
  -H "Authorization: Bearer <token>"
```

### 3. Remove Member
```bash
curl -X DELETE http://localhost:5000/api/projects/1/members/2 \
  -H "Authorization: Bearer <token>"
```

## Task Endpoints

### 1. Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "projectId": 1,
    "title": "Implement login",
    "description": "Add JWT authentication",
    "priority": "High",
    "assigned_to": 2,
    "due_date": "2024-12-31"
  }'
```

### 2. Get Project Tasks
```bash
curl -X GET http://localhost:5000/api/tasks/project/1 \
  -H "Authorization: Bearer <token>"
```

### 3. Get Task Details
```bash
curl -X GET http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

### 4. Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "In Progress",
    "priority": "Medium",
    "assigned_to": 2
  }'
```

### 5. Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

## Dashboard Endpoints

### 1. Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer <token>"
```

Response:
```json
{
  "totalTasks": 10,
  "totalProjects": 3,
  "completedTasks": 4,
  "inProgressTasks": 3,
  "todoTasks": 3,
  "overdueTasks": 1,
  "recentTasks": [...]
}
```

### 2. Get Assigned Tasks
```bash
curl -X GET http://localhost:5000/api/dashboard/assigned \
  -H "Authorization: Bearer <token>"
```

## Health Check

```bash
curl -X GET http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK"
}
```

## Testing with Postman

1. Create a new Postman collection
2. Set base URL as environment variable
3. Create requests for each endpoint
4. Set authorization header with token
5. Save responses as examples

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 400 Bad Request
```json
{
  "error": "Project name is required"
}
```

### 500 Server Error
```json
{
  "error": "Failed to create project"
}
```

## Test Scenarios

### Scenario 1: Admin Creates Project
1. Signup as Admin
2. Create project
3. Add members to project
4. Assign roles
5. Create tasks
6. View dashboard

### Scenario 2: Member Joins and Works
1. Signup as Member
2. Get added to project
3. View assigned tasks
4. Update task status
5. Complete tasks

### Scenario 3: Role-Based Access
1. Admin creates project
2. Admin assigns Admin role to member
3. Member can now manage project
4. Member can delete tasks
5. Regular member cannot delete

## Performance Testing

```bash
# Test with multiple requests
for i in {1..10}; do
  curl -X GET http://localhost:5000/api/projects \
    -H "Authorization: Bearer <token>"
done
```

## Load Testing (using Apache Bench)

```bash
ab -n 100 -c 10 -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/dashboard
```

---

**Tips**: Always include the Authorization header for protected endpoints!
