import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authService = {
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Project APIs
export const projectService = {
  createProject: (name: string, description: string) =>
    api.post('/projects', { name, description }),
  getProjects: () => api.get('/projects'),
  getProjectById: (id: number) => api.get(`/projects/${id}`),
  updateProject: (id: number, name: string, description: string) =>
    api.put(`/projects/${id}`, { name, description }),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),
  addMember: (projectId: number, userId: number, role: string) =>
    api.post('/projects/members/add', { projectId, userId, role }),
  getProjectMembers: (projectId: number) =>
    api.get(`/projects/${projectId}/members`),
  removeMember: (projectId: number, userId: number) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

// Task APIs
export const taskService = {
  createTask: (projectId: number, title: string, description: string, priority: string, assigned_to: number | null, due_date: string | null) =>
    api.post('/tasks', { projectId, title, description, priority, assigned_to, due_date }),
  getProjectTasks: (projectId: number) =>
    api.get(`/tasks/project/${projectId}`),
  getTaskById: (id: number) => api.get(`/tasks/${id}`),
  updateTask: (id: number, data: any) =>
    api.put(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// Dashboard APIs
export const dashboardService = {
  getDashboard: () => api.get('/dashboard'),
  getAssignedTasks: () => api.get('/dashboard/assigned'),
};

export default api;
