import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import TrialEnrollment from "../models/TrialEnrollment.js";
// import Course from "../models/Course.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Course from "../models/Course.js";

import { sendEmail } from "../utils/sendEmail.js";
import { trialPurchasedTemplate } from "../email-templates/trialPurchasedTemplate.js";

const router = express.Router();

router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// router.post(
//   "/trial-order",
//   protect,
//   async (req, res) => {

//     try {

//       const { courseId } = req.body;

//       const course =
//         await Course.findById(courseId);

//       if (!course) {
//         return res.status(404).json({
//           message: "Course not found"
//         });
//       }

//       const options = {

//         amount:
//           course.pricing.trial * 100,

//         currency: "INR",

//         receipt:
//           "trial_" + Date.now()
//       };

//       const order =
//         await razorpay.orders.create(
//           options
//         );

//       res.json({
//         order,
//         key:
//           process.env.RAZORPAY_KEY_ID
//       });

//     } catch (error) {

//       res.status(500).json({
//         message: error.message
//       });
//     }
//   }
// );


// router.post("/trial-verify", protect, async (req, res) => {
//   try {
//     console.log("CourseId:", courseId);
//     const { razorpay_payment_id, courseId } = req.body;
//     console.log("CourseId:", courseId);

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({
//         message: "Course not found"
//       });
//     }

//     await TrialEnrollment.create({
//       studentId: req.user._id,
//       courseId,
//       paymentId: razorpay_payment_id,
//       amount: course.pricing.trial,
//       status: "PENDING"
//     });

//     res.json({ success: true });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// });




router.post("/trial-order", protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!course.pricing?.trial) {
      return res.status(400).json({
        message: "Trial price not available"
      });
    }

    const amount = Number(course.pricing.trial);

    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: `trial_${Date.now()}`
    });

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Trial Order Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});



router.post("/trial-verify", protect, async (req, res) => {
   try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = req.body;

    if (!process.env.RAZORPAY_SECRET) {
      return res.status(500).json({
        message: "Razorpay secret not configured"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    // ✅ Prevent duplicate trial
    const existingTrial = await TrialEnrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (existingTrial) {
      return res.status(400).json({
        message: "Trial already purchased"
      });
    }

    const trial = await TrialEnrollment.create({
      studentId: req.user._id,
      courseId,
      paymentId: razorpay_payment_id,
      amount: Number(course.pricing.trial),
      status: "PENDING"
    });


    // await TrialEnrollment.create({
    //   studentId: req.user._id,
    //   courseId,
    //   paymentId: razorpay_payment_id,
    //   amount: Number(course.pricing.trial),
    //   status: "PENDING"
    // });

    // ✅ Get user details
    const user = await User.findById(req.user._id);

    // ✅ SEND EMAIL
    // await sendEmail(
    //   user.email,
    //   "Trial Activated 🎯",
    //   trialPurchasedTemplate({
    //     studentName: user.name,
    //     courseName: course.title,
    //     amount: course.pricing.trial,
    //     paymentId: razorpay_payment_id
    //   })
    // );

    res.json({
      success: true,
      message: "Trial purchased successfully"
    });

  } catch (error) {
    console.error("Trial Verify Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;