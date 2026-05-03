export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Member";
}

export interface Project {
  id: number;
  name: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Member";
  joined_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assigned_to: number | null;
  assigned_to_name?: string;
  due_date: string | null;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  project_name?: string;
}

export interface DashboardData {
  totalTasks: number;
  totalProjects: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  recentTasks: Task[];
}
