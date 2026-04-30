import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyEnrollments } from "../controllers/enrollmentController.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

router.get("/my", protect, getMyEnrollments);

// enrollmentRoutes.js
router.get("/course/:courseId", protect, async (req, res) => {
  const enrollments = await Enrollment.find({
    courseId: req.params.courseId
  }).populate("studentId", "name email");

  res.json(enrollments);
});

export default router;