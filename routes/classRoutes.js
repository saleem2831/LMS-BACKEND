import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createBatch, createClass, getClasses } from "../controllers/classController.js";

const router = express.Router();

router.post("/batch", protect, authorize("INSTRUCTOR"), createBatch);

router.post("/", protect, authorize("INSTRUCTOR"), createClass);

router.get("/", protect, getClasses);

export default router;