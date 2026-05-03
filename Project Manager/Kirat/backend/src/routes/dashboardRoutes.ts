import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getDashboard, getAssignedTasks } from "../controllers/dashboardController";

const router = Router();

router.get("/", authMiddleware, getDashboard);
router.get("/assigned", authMiddleware, getAssignedTasks);

export default router;
