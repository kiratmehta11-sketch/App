export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Member";
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: "Admin" | "Member";
  joined_at: Date;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assigned_to: number | null;
  due_date: Date | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: "Admin" | "Member";
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends AuthRequest {
  name: string;
}
