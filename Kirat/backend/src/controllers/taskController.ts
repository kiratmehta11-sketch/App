import { Request, Response } from "express";
import db from "../database/connection";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, title, description, priority, assigned_to, due_date } =
      req.body;
    const userId = req.user?.id;

    // Validation
    if (!projectId || !title) {
      return res
        .status(400)
        .json({ error: "Project ID and title are required" });
    }

    // Check if user is member of the project
    const memberCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get(projectId, userId);

    if (!memberCheck) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Create task
    const result = db.prepare(
      `INSERT INTO tasks (project_id, title, description, priority, assigned_to, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(projectId, title, description || "", priority || "Medium", assigned_to || null, due_date || null, userId);

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getProjectTasks = async (req: Request, res: Response) => {
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

    const tasks = db.prepare(
      `SELECT t.*, u.name as assigned_to_name, c.name as created_by_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN users c ON t.created_by = c.id
       WHERE t.project_id = ?
       ORDER BY t.created_at DESC`
    ).all(projectId);

    res.json(tasks);
  } catch (error) {
    console.error("Get project tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    // Get task and check access
    const task = db.prepare(
      `SELECT t.*, u.name as assigned_to_name, c.name as created_by_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN users c ON t.created_by = c.id
       WHERE t.id = ?`
    ).get(taskId) as any;

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is member of the project
    const memberCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get((task as any).project_id, userId);

    if (!memberCheck) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assigned_to, due_date } =
      req.body;
    const userId = req.user?.id;

    // Get task
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as any;

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is member of project
    const memberCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?"
    ).get((task as any).project_id, userId);

    if (!memberCheck) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update task
    db.prepare(
      `UPDATE tasks
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           status = COALESCE(?, status),
           priority = COALESCE(?, priority),
           assigned_to = COALESCE(?, assigned_to),
           due_date = COALESCE(?, due_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(title, description, status, priority, assigned_to, due_date, taskId);

    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    // Get task
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as any;

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is admin of project or created the task
    const adminCheck = db.prepare(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ? AND role = 'Admin'"
    ).get((task as any).project_id, userId);

    if (!adminCheck && (task as any).created_by !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
