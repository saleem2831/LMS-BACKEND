import express from "express";

import TrialEnrollment from
"../models/TrialEnrollment.js";

import DemoClass from
"../models/DemoClass.js";

import User from
"../models/User.js";

import Course from
"../models/Course.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get(
//   "/trial-requests",

//   protect,

//   authorize("SALES"),

//   async (req, res) => {

//     try {

//       const trials =
//         await TrialEnrollment.find()

//           .populate(
//             "studentId",
//             "name email mobile"
//           )

//           .populate(
//             "courseId",
//             "title"
//           );

//       res.json(trials);

//     } catch (error) {

//       res.status(500).json({
//         message: error.message
//       });
//     }
//   }
// );


router.get(
  "/trial-requests",

  protect,

  authorize("SALES"),

  async (req, res) => {

    try {

      const trials =
        await TrialEnrollment.find()

        .populate(
          "studentId",
          "name email mobile"
        )

        .populate(
          "courseId",
          "title"
        )

        .sort({
          createdAt: -1
        });

      res.json(trials);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);


router.get(
  "/instructors",

  protect,

  authorize("SALES"),

  async (req, res) => {

    const instructors =
      await User.find({
        role: "INSTRUCTOR"
      });

    res.json(instructors);
  }
);



router.post(
  "/schedule-demo",

  protect,

  authorize("SALES"),

  async (req, res) => {

    try {

      const {

        trialEnrollmentId,

        instructorId,

        startTime,

        endTime,

        meetLink,

        notes

      } = req.body;

      const trial =
        await TrialEnrollment.findById(
          trialEnrollmentId
        );

      if (!trial) {

        return res.status(404).json({
          message:
            "Trial not found"
        });
      }

    //   const demo = await DemoClass.create({

    //       trialEnrollmentId,

    //       studentId:
    //         trial.studentId,

    //       instructorId,

    //       salesId:
    //         req.user._id,

    //       courseId:
    //         trial.courseId,

    //       startTime,

    //       endTime,

    //       meetLink,

    //       notes
    //     });

    // CHECK IF SLOT ALREADY BOOKED

const existingDemo =
  await DemoClass.findOne({

    instructorId,

    startTime:
      new Date(startTime),

    status:
      "SCHEDULED"
  });

if (existingDemo) {

  return res.status(400).json({

    message:
      "This slot is already booked"
  });
}

// CREATE DEMO

const demo =

  await DemoClass.create({

    trialEnrollmentId,

    studentId:
      trial.studentId,

    instructorId,

    salesId:
      req.user._id,

    courseId:
      trial.courseId,

    startTime,

    endTime,

    meetLink,

    notes
  });

      trial.status =
        "SCHEDULED";

      await trial.save();

      res.json(demo);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);


// router.put(
//   "/trial-status/:id",

//   protect,

//   authorize("SALES"),

//   async (req, res) => {

//     try {

//       const { status } = req.body;

//       const trial =
//         await TrialEnrollment.findById(
//           req.params.id
//         );

//       trial.status = status;

//       await trial.save();

//       res.json(trial);

//     } catch (error) {

//       res.status(500).json({
//         message: error.message
//       });
//     }
//   }
// );


// ==========================================
// UPDATE TRIAL STATUS
// ==========================================

router.put(
  "/trial-status/:id",
  protect,
  authorize("SALES"),
  async (req, res) => {
    try {

      const { status } = req.body;

      // VALIDATION
      const allowedStatuses = [
        "PENDING",
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }

      // FIND TRIAL
      const trial = await TrialEnrollment.findById(
        req.params.id
      );

      if (!trial) {
        return res.status(404).json({
          message: "Trial not found"
        });
      }

      // UPDATE TRIAL STATUS
      trial.status = status;

      await trial.save();

      // ==========================================
      // UPDATE DEMO CLASS STATUS ALSO
      // ==========================================

      await DemoClass.updateMany(
        {
          trialEnrollmentId: trial._id
        },
        {
          status
        }
      );

      // RETURN UPDATED DATA
      const updatedTrial =
        await TrialEnrollment.findById(trial._id)
          .populate("studentId", "name email")
          .populate("courseId", "title");

      res.json(updatedTrial);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);

router.put(
  "/demo-status/:id",

  protect,

  authorize("SALES"),

  async (req, res) => {

    try {

      const { status } = req.body;

      const allowedStatuses = [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED"
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }

      const demo =
        await DemoClass.findById(
          req.params.id
        );

      if (!demo) {
        return res.status(404).json({
          message: "Demo class not found"
        });
      }

      // UPDATE DEMO STATUS
      demo.status = status;

      await demo.save();

      // OPTIONAL:
      // ALSO UPDATE TRIAL STATUS

      await TrialEnrollment.findByIdAndUpdate(
        demo.trialEnrollmentId,
        {
          status
        }
      );

      res.json({
        message:
          "Demo status updated",
        demo
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

export default router;