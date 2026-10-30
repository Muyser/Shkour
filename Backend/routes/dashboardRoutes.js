import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// مسار إحصائيات لوحة التحكم (محمي للمشرف فقط)
router.get("/stats", protect, admin, getDashboardStats);

export default router;