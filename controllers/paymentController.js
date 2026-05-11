// import razorpay from "../config/razorpay.js";
// import Course from "../models/Course.js";
// import crypto from "crypto";
// import Enrollment from "../models/Enrollment.js";

// export const createOrder = async (req, res) => {
//   try {
//     const { courseId, plan } = req.body;

//     const course = await Course.findById(courseId);

//     const amount =
//       plan === "ONE_TO_ONE"
//         ? course.pricing.oneToOne
//         : course.pricing.batch;

//     const options = {
//       amount: amount * 100, // paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       order,
//       key: process.env.RAZORPAY_KEY_ID
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       courseId,
//       plan
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Payment failed" });
//     }

//     // Create enrollment
//     const enrollment = await Enrollment.create({
//       studentId: req.user._id,
//       courseId,
//       plan,
//       paymentId: razorpay_payment_id
//     });

//     res.json({ message: "Payment success", enrollment });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import razorpay from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";

import Enrollment from "../models/Enrollment.js";
import TrialEnrollment from "../models/TrialEnrollment.js";

import { sendEmail } from "../utils/sendEmail.js";
import { courseEnrolledTemplate } from "../email-templates/courseEnrolledTemplate.js";


// ==============================
// CREATE ORDER
// ==============================

export const createOrder = async (req, res) => {
  try {

    const { courseId, plan } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    let amount = 0;

    // 1 TO 1
    if (plan === "ONE_TO_ONE") {
      amount = course.pricing.oneToOne;
    }

    // BATCH
    else if (plan === "BATCH") {
      amount = course.pricing.batch;
    }

    // TRIAL
    else if (plan === "TRIAL") {
      amount = course.pricing.trial;
    }

    else {
      return res.status(400).json({
        message: "Invalid plan"
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ==============================
// VERIFY PAYMENT
// ==============================

export const verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      plan
    } = req.body;

    // VERIFY SIGNATURE
    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({
        message: "Payment failed"
      });

    }

    // ==========================
    // TRIAL PURCHASE
    // ==========================

    if (plan === "TRIAL") {

      // prevent duplicate trial
      const existingTrial =
        await TrialEnrollment.findOne({
          studentId: req.user._id,
          courseId
        });

      if (existingTrial) {

        return res.status(400).json({
          message:
            "Trial already purchased for this course"
        });

      }

      const trial = await TrialEnrollment.create({

        studentId: req.user._id,

        courseId,

        paymentId: razorpay_payment_id,

        status: "PENDING"

      });

      return res.json({
        message: "Trial purchased successfully",
        trial
      });

    }

    // ==========================
    // NORMAL ENROLLMENT
    // ==========================

    // prevent duplicate enrollment
    const existingEnrollment =
      await Enrollment.findOne({
        studentId: req.user._id,
        courseId,
        plan
      });

    if (existingEnrollment) {

      return res.status(400).json({
        message:
          "Already enrolled in this course"
      });

    }

    // create enrollment
    const enrollment = await Enrollment.create({

      studentId: req.user._id,

      courseId,

      plan,

      paymentId: razorpay_payment_id,

      status: "paid"

    });

     // ✅ GET USER + COURSE DETAILS
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    // ✅ SEND EMAIL
    // await sendEmail(
    //   user.email,
    //   "Course Enrollment Confirmed 🎉",
    //   courseEnrolledTemplate({
    //     studentName: user.name,
    //     courseName: course.title,
    //     plan,
    //     paymentId: razorpay_payment_id
    //   })
    // );

    res.json({
      message: "Payment success",
      enrollment
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};