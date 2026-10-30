import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// مسار إنشاء طلب (متاح للطلاب - طلب واحد لكل واتساب)
router.post("/", createApplication);

// مسارات لوحة التحكم الخاصة بالمشرفين (تتطلب مصادقة وصلاحية مشرف)
router.get("/", protect, admin, getApplications);
router.get("/:id", protect, admin, getApplicationById);
router.put("/:id", protect, admin, updateApplication);
router.delete("/:id", protect, admin, deleteApplication);

export default router;