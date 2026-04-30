import express from "express";
import upload from "../middleware/uploadS3.js";
import { createCourse } from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getCourses, approveCourse, assignInstructor } from "../controllers/courseController.js";
import Course from "../models/Course.js";



const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "INSTRUCTOR"),
  upload.fields([
    { name: "curriculumPdf", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  createCourse
);


// Get courses
router.get("/", getCourses);

// Approve course (admin only)
router.put(
  "/:id/approve",
  protect,
  authorize("ADMIN"),
  approveCourse
);

router.put(
  "/:id/assign",
  protect,
  authorize("ADMIN"),
  assignInstructor
);

// router.put("/:id", protect, authorize("ADMIN"), async (req, res) => {
//   const course = await Course.findById(req.params.id);

//   course.title = req.body.title || course.title;
//   course.description = req.body.description || course.description;

//   if (req.body.oneToOne)
//     course.pricing.oneToOne = req.body.oneToOne;

//   if (req.body.batch)
//     course.pricing.batch = req.body.batch;

//   await course.save();

//   res.json(course);
// });

router.put("/:id", protect, authorize("ADMIN"), async (req, res) => {
  const course = await Course.findById(req.params.id);

  course.title = req.body.title || course.title;
  course.description = req.body.description || course.description;

  if (req.body.pricing) {
    course.pricing.oneToOne =
      req.body.pricing.oneToOne ?? course.pricing.oneToOne;

    course.pricing.batch =
      req.body.pricing.batch ?? course.pricing.batch;
  }

  await course.save();

  res.json(course);
});

// courseRoutes.js
router.get("/my", protect, authorize("INSTRUCTOR"), async (req, res) => {
  const courses = await Course.find({
    assignedInstructor: req.user._id
  });

  res.json(courses);
});

export default router;