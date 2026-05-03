import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
  removeMember,
} from "../controllers/projectController";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

// Project members
router.post("/members/add", authMiddleware, addMember);
router.get("/:projectId/members", authMiddleware, getProjectMembers);
router.delete("/:projectId/members/:userId", authMiddleware, removeMember);

export default router;
