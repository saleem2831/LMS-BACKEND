import razorpay from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";

export const createOrder = async (req, res) => {
  try {
    const { courseId, plan } = req.body;

    const course = await Course.findById(courseId);

    const amount =
      plan === "ONE_TO_ONE"
        ? course.pricing.oneToOne
        : course.pricing.batch;

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      plan
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment failed" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId,
      plan,
      paymentId: razorpay_payment_id
    });

    res.json({ message: "Payment success", enrollment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};