import express from "express";
import {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institutionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getInstitutions);
router.get("/:id", getInstitutionById);

router.post("/", protect, admin, upload.single("image"), createInstitution);
router.put("/:id", protect, admin, upload.single("image"), updateInstitution);
router.delete("/:id", protect, admin, deleteInstitution);

export default router;