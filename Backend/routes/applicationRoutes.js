import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadFileToCloudinary,
} from "../controllers/applicationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js"; // استيراد Multer من ملف إعدادات Cloudinary

const router = express.Router();

// 📁 مسار رفع الملفات والمستندات إلى Cloudinary (يجب وضعه قبل مسارات الـ :id)
router.post("/upload", upload.single("file"), uploadFileToCloudinary);

// مسار إنشاء طلب (متاح للطلاب - طلب واحد لكل واتساب لكل مؤسسة)
router.post("/", createApplication);

// مسارات لوحة التحكم الخاصة بالمشرفين (تتطلب مصادقة وصلاحية مشرف)
router.get("/", protect, admin, getApplications);
router.get("/:id", protect, admin, getApplicationById);
router.put("/:id", protect, admin, updateApplication);
router.delete("/:id", protect, admin, deleteApplication);

export default router;