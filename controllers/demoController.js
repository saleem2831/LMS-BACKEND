// import Demo from "../models/Demo.js";
// import Class from "../models/Class.js";
// import TrialEnrollment from "../models/TrialEnrollment.js";


// export const createDemo = async (req, res) => {
//   try {
//     const {
//       studentName,
//       studentPhone,
//       studentEmail,
//       courseId,
//       instructorId,
//       scheduledTime,
//       meetLink,
//       notes
//     } = req.body;

//     // CHECK INSTRUCTOR SLOT
//     const existingClass = await Class.findOne({
//       instructorId,
//       startTime: new Date(scheduledTime)
//     });

//     const existingDemo = await Demo.findOne({
//       instructorId,
//       scheduledTime: new Date(scheduledTime)
//     });

//     if (existingClass || existingDemo) {
//       return res.status(400).json({
//         message: "Instructor not available at this time"
//       });
//     }

//     const demo = await Demo.create({
//       studentName,
//       studentPhone,
//       studentEmail,
//       courseId,
//       instructorId,
//       scheduledTime,
//       meetLink,
//       notes
//     });

//     res.json(demo);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getDemos = async (req, res) => {
//   try {
//     const demos = await Demo.find()
//       .populate("courseId", "title")
//       .populate("instructorId", "name email")
//       .sort({ scheduledTime: 1 });

//     res.json(demos);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateDemoStatus = async (req, res) => {
//   try {
//     const demo = await Demo.findById(req.params.id);

//     if (!demo) {
//       return res.status(404).json({
//         message: "Demo not found"
//       });
//     }

//     demo.status = req.body.status;

//     await demo.save();

//     res.json(demo);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const scheduleDemo = async (req, res) => {

//   try {

//     const {
//       trialEnrollmentId,
//       instructorId,
//       scheduledTime,
//       meetLink,
//       notes
//     } = req.body;

//     // fetch trial
//     const trial = await TrialEnrollment.findById(
//       trialEnrollmentId
//     )
//       .populate("studentId")
//       .populate("courseId");

//     if (!trial) {
//       return res.status(404).json({
//         message: "Trial not found"
//       });
//     }

//     // check instructor busy
//     const existingClass = await Class.findOne({
//       instructorId,
//       startTime: new Date(scheduledTime)
//     });

//     if (existingClass) {
//       return res.status(400).json({
//         message: "Instructor busy"
//       });
//     }

//     // create demo
//     const demo = await Demo.create({

//       studentName: trial.studentId.name,

//       studentPhone: trial.studentId.mobile,

//       studentEmail: trial.studentId.email,

//       courseId: trial.courseId._id,

//       instructorId,

//       scheduledTime,

//       meetLink,

//       notes,

//       trialEnrollmentId
//     });

//     // update trial status
//     trial.status = "SCHEDULED";

//     trial.demoId = demo._id;

//     await trial.save();

//     res.json(demo);

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };


import Demo from "../models/Demo.js";

import TrialEnrollment from "../models/TrialEnrollment.js";

import Class from "../models/Class.js";

import { sendEmail } from "../utils/sendEmail.js";
import { demoScheduledTemplate } from "../email-templates/demoScheduledTemplate.js";

export const scheduleDemo = async (req, res) => {

  try {

    const {
      trialEnrollmentId,
      instructorId,
      scheduledTime,
      meetLink,
      notes
    } = req.body;

    const trial = await TrialEnrollment.findById(
      trialEnrollmentId
    )
      .populate("studentId")
      .populate("courseId");

    if (!trial) {
      return res.status(404).json({
        message: "Trial not found"
      });
    }

    // CHECK CLASS CONFLICT

    const existingClass = await Class.findOne({
      instructorId,
      startTime: new Date(scheduledTime)
    });

    const existingDemo = await Demo.findOne({
      instructorId,
      scheduledTime: new Date(scheduledTime)
    });

    if (existingClass || existingDemo) {
      return res.status(400).json({
        message: "Instructor not available"
      });
    }

    const demo = await Demo.create({

      trialEnrollmentId,

      studentId: trial.studentId._id,

      courseId: trial.courseId._id,

      instructorId,

      scheduledTime,

      meetLink,

      notes
    });

    trial.status = "SCHEDULED";

    trial.demoId = demo._id;

    await trial.save();

     // ✅ SEND EMAIL TO STUDENT
    await sendEmail(
      trial.studentId.email,
      "Demo Class Scheduled 🎯",
      demoScheduledTemplate({
        studentName: trial.studentId.name,
        courseName: trial.courseId.title,
        instructorName: "Your Instructor", // (optional: populate instructor)
        scheduledTime,
        meetLink,
        notes
      })
    );

    res.json(demo);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


export const getDemos = async (req, res) => {

  try {

    const demos = await Demo.find()

      .populate("studentId", "name email")

      .populate("courseId", "title")

      .populate("instructorId", "name");

    res.json(demos);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};