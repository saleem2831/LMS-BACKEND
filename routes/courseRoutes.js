import express from "express";
import upload from "../middleware/uploadS3.js";
import { createCourse } from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getCourses, approveCourse, assignInstructor, removeInstructor,getCourseById,deleteCourse } from "../controllers/courseController.js";
import Course from "../models/Course.js";



const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "INSTRUCTOR"),
  upload.fields([
    { name: "curriculumPdf", maxCount: 1 },
   { name: "curriculumInsPdf", maxCount: 1 },
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

router.put(
  "/:courseId/remove-instructor",
  protect,
  authorize("ADMIN"),
  removeInstructor
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

// router.put("/:id", protect, authorize("ADMIN"), async (req, res) => {
//   const course = await Course.findById(req.params.id);

//   course.title = req.body.title || course.title;
//   course.description = req.body.description || course.description;

//   if (req.body.pricing) {
//     course.pricing.oneToOne =
//       req.body.pricing.oneToOne ?? course.pricing.oneToOne;

//     course.pricing.batch =
//       req.body.pricing.batch ?? course.pricing.batch;

//       course.pricing.trial =
//       req.body.pricing.trial ?? course.pricing.trial;
//   }

//   await course.save();

//   res.json(course);
// });

// router.put("/:id", protect, authorize("ADMIN"), async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);

//     if (!course) {
//       return res.status(404).json({
//         message: "Course not found"
//       });
//     }

//     course.title = req.body.title || course.title;
//     course.description = req.body.description || course.description;

//     if (req.body.pricing) {
//       course.pricing.oneToOne =
//         req.body.pricing.oneToOne ?? course.pricing.oneToOne;

//       course.pricing.batch =
//         req.body.pricing.batch ?? course.pricing.batch;

//       course.pricing.trial =
//         req.body.pricing.trial ?? course.pricing.trial; // ✅ FIXED
//     }

//     await course.save();

//     res.json(course);

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// });

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  upload.fields([
    {
      name: "curriculumPdf",
      maxCount: 1,
    },
    {
      name: "curriculumInsPdf",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;

      if (req.body.pricing) {
        const pricing =
          typeof req.body.pricing === "string"
            ? JSON.parse(req.body.pricing)
            : req.body.pricing;

        course.pricing.oneToOne =
          pricing.oneToOne ?? course.pricing.oneToOne;

        course.pricing.batch =
          pricing.batch ?? course.pricing.batch;

        course.pricing.trial =
          pricing.trial ?? course.pricing.trial;
      }

      // Student PDF
      if (req.files?.curriculumPdf) {
        course.curriculumPdf =
          req.files.curriculumPdf[0].location;
      }

      // Instructor PDF
      if (req.files?.curriculumInsPdf) {
        course.curriculumInsPdf =
          req.files.curriculumInsPdf[0].location;
      }

      // Image
      if (req.files?.image) {
        course.image =
          req.files.image[0].location;
      }

      await course.save();

      res.json(course);

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// courseRoutes.js
router.get("/my", protect, authorize("INSTRUCTOR"), async (req, res) => {
  const courses = await Course.find({
    assignedInstructor: req.user._id
  });

  res.json(courses);
});

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteCourse
);

router.get(
  "/:id",
  getCourseById
);

export default router;