import express from "express";
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js"; 

const router = express.Router();

// مسارات عامة (Public)
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItemById);

// مسارات محمية للمشرف فقط (Admin Only) مع تحديث اسم الحقل إلى "image" ليتطابق مع الواجهة الأمامية
router.post("/", protect, admin, upload.single("image"), createGalleryItem);
router.put("/:id", protect, admin, upload.single("image"), updateGalleryItem);
router.delete("/:id", protect, admin, deleteGalleryItem);

export default router;