import express from "express";
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// مسارات عامة (Public)
router.get("/", getPrograms);
router.get("/:id", getProgramById);

// مسارات محمية (للمشرف فقط)
router.post("/", protect, admin, createProgram);
router.put("/:id", protect, admin, updateProgram);
router.delete("/:id", protect, admin, deleteProgram);

export default router;