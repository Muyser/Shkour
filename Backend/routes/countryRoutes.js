import express from "express";
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// مسارات عامة (Public) للطلاب والزوار
router.get("/", getCountries);
router.get("/:id", getCountryById);

// مسارات محمية للمشرف فقط (Admin Only) مع دعم رفع الصور عبر multer و Cloudinary
router.post("/", protect, admin, upload.single("image"), createCountry);
router.put("/:id", protect, admin, upload.single("image"), updateCountry);
router.delete("/:id", protect, admin, deleteCountry);

export default router;