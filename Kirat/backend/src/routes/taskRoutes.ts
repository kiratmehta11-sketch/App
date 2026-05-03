import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// More specific routes first
router.get("/project/:projectId", authMiddleware, getProjectTasks);

// Then less specific routes
router.post("/", authMiddleware, createTask);
router.get("/:taskId", authMiddleware, getTaskById);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

export default router;
