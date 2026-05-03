import { Request, Response } from "express";
import db from "../database/connection";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // Create project
    const result = db.prepare(
      "INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)"
    ).run(name, description || "", userId);

    // Add creator as Admin member
    db.prepare(
      "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)"
    ).run(result.lastInsertRowid, userId, "Admin");

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get projects where user is a member
    const projects = db.prepare(
      `SELECT DISTINCT p.* FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = ?
       ORDER BY p.created_at DESC`
    ).all(userId);

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is a member
    const memberCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get(id, userId);

    if (!memberCheck) {
      return res.status(403).json({ error: "Access denied" });
    }

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user?.id;

    // Check if user is admin of the project
    const adminCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ? AND role = 'Admin'"
    ).get(id, userId);

    if (!adminCheck) {
      return res.status(403).json({ error: "Admin access required" });
    }

    db.prepare(
      "UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description), updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(name || null, description || null, id);

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is admin of the project
    const adminCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ? AND role = 'Admin'"
    ).get(id, userId);

    if (!adminCheck) {
      return res.status(403).json({ error: "Admin access required" });
    }

    db.prepare("DELETE FROM projects WHERE id = ?").run(id);

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { projectId, userId, role } = req.body;
    const currentUserId = req.user?.id;

    // Validate input
    if (!projectId || !userId || !role) {
      return res
        .status(400)
        .json({ error: "projectId, userId, and role are required" });
    }

    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if current user is admin
    const adminCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ? AND role = 'Admin'"
    ).get(projectId, currentUserId);

    if (!adminCheck) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if user exists
    const userExists = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add member
    try {
      db.prepare(
        "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)"
      ).run(projectId, userId, role);
    } catch {
      db.prepare(
        "UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?"
      ).run(role, projectId, userId);
    }

    const member = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get(projectId, userId);

    res.status(201).json(member);
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
};

export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    // Check if user is member
    const memberCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get(projectId, userId);

    if (!memberCheck) {
      return res.status(403).json({ error: "Access denied" });
    }

    const members = db.prepare(
      `SELECT u.id, u.name, u.email, pm.role, pm.joined_at
       FROM project_members pm
       INNER JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?
       ORDER BY pm.joined_at ASC`
    ).all(projectId);

    res.json(members);
  } catch (error) {
    console.error("Get project members error:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { projectId, userId } = req.params;
    const currentUserId = req.user?.id;

    // Check if current user is admin
    const adminCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ? AND role = 'Admin'"
    ).get(projectId, currentUserId);

    if (!adminCheck) {
      return res.status(403).json({ error: "Admin access required" });
    }

    db.prepare(
      "DELETE FROM project_members WHERE project_id = ? AND user_id = ?"
    ).run(projectId, userId);

    res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};
