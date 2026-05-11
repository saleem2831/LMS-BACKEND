import express from "express";


import Course from "../models/Course.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";


import TrialEnrollment from
"../models/TrialEnrollment.js";

import DemoClass from
"../models/DemoClass.js";



const router = express.Router();


// BUY TRIAL
router.post(
  "/buy",
  protect,
  authorize("STUDENT"),
  async (req, res) => {

    try {

      const { courseId } = req.body;

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found"
        });
      }

      const trial = await TrialEnrollment.create({
        studentId: req.user._id,
        courseId,
        amount: course.pricing.trial,
        paymentId: "trial_" + Date.now()
      });

      res.json(trial);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// SALES FETCH TRIALS
router.get(
  "/",
  protect,
  authorize("ADMIN", "SALES"),
  async (req, res) => {

    const trials = await TrialEnrollment.find()

      .populate(
        "studentId",
        "name email mobile"
      )

      .populate(
        "courseId",
        "title pricing"
      )

      .populate("demoId");

    res.json(trials);
  }
);

router.get(
  "/my-trials",

  protect,

  async (req, res) => {

    try {

      const trials =
        await TrialEnrollment.find({

          studentId:
            req.user._id

        })

        .populate(
          "courseId",
          "title image"
        );

      // attach demo details

      const result =
        await Promise.all(

          trials.map(async (t) => {

            const demo =
              await DemoClass.findOne({

                trialEnrollmentId:
                  t._id

              })

              .populate(
                "instructorId",
                "name email"
              );

            return {

              ...t.toObject(),

              demoClass: demo
            };
          })
        );

      res.json(result);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

// router.put(
//   "/trial-status/:id",
//    async (req, res) => {

//     try {

//       const { status } =
//         req.body;

//       const updated =
//         await TrialEnrollment.findByIdAndUpdate(
//           req.params.id,
//           { status },
//           { new: true }
//         );

//       res.json(updated);

//     } catch (error) {

//       res.status(500).json({
//         message:
//           "Failed to update status"
//       });
//     }
//   }
// );

router.put(
  "/trial-status/:id",
  protect,
  authorize("SALES"),
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const trial =
        await TrialEnrollment.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      res.json(trial);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to update status"
      });
    }
  }
);


router.put(
  "/:id/complete",
  protect,
   authorize("STUDENT"),
  async (
  req,
  res
) => {

  try {

    const trial =
      await Trial.findById(
        req.params.id
      );

    if (!trial) {

      return res.status(404).json({
        message: "Trial not found"
      });
    }

    trial.status = "COMPLETED";

    await trial.save();

    res.json({
      message:
        "Trial marked completed"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
}
);

export default router;


