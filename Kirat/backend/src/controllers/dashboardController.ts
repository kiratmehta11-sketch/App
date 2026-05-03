import { Request, Response } from "express";
import db from "../database/connection";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get all projects the user is member of
    const projects = db.prepare(
      `SELECT p.* FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = ?`
    ).all(userId);

    const projectIds = projects.map((p: any) => p.id);

    if (projectIds.length === 0) {
      return res.json({
        totalTasks: 0,
        totalProjects: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        overdueTasks: 0,
        recentTasks: [],
      });
    }

    // Get task statistics for each project separately
    const placeholders = projectIds.map(() => '?').join(',');
    const statsResult = db.prepare(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
         SUM(CASE WHEN status = 'To Do' THEN 1 ELSE 0 END) as todo,
         SUM(CASE WHEN status != 'Completed' AND due_date < date('now') THEN 1 ELSE 0 END) as overdue
       FROM tasks
       WHERE project_id IN (${placeholders})`
    ).get(...projectIds);

    const stats = (statsResult || {}) as any;

    // Get recent tasks (last 10)
    const recentTasks = db.prepare(
      `SELECT t.*, u.name as assigned_to_name, p.name as project_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.project_id IN (${placeholders})
       ORDER BY t.created_at DESC
       LIMIT 10`
    ).all(...projectIds);

    res.json({
      totalTasks: parseInt(stats.total) || 0,
      totalProjects: projectIds.length,
      completedTasks: parseInt(stats.completed) || 0,
      inProgressTasks: parseInt(stats.in_progress) || 0,
      todoTasks: parseInt(stats.todo) || 0,
      overdueTasks: parseInt(stats.overdue) || 0,
      recentTasks,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getAssignedTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const tasks = db.prepare(
      `SELECT t.*, p.name as project_name, c.name as created_by_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users c ON t.created_by = c.id
       WHERE t.assigned_to = ?
       ORDER BY CASE
         WHEN t.status = 'To Do' THEN 1
         WHEN t.status = 'In Progress' THEN 2
         WHEN t.status = 'Completed' THEN 3
         ELSE 4
       END, t.due_date ASC`
    ).all(userId);

    res.json(tasks);
  } catch (error) {
    console.error("Get assigned tasks error:", error);
    res.status(500).json({ error: "Failed to fetch assigned tasks" });
  }
};
