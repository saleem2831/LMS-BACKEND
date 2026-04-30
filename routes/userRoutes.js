import express from "express";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";        // ✅ ADD THIS




const router = express.Router();

// Get all students (ADMIN only)
router.get("/students", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const students = await User.find({ role: "STUDENT" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/create-instructor",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const instructor = await User.create({
        name,
        email,
        password,
        role: "INSTRUCTOR"
      });

      res.json(instructor);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all users (ADMIN)
router.get("/", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, authorize("ADMIN"), async (req, res) => {
  const user = await User.findById(req.params.id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  await user.save();

  res.json(user);
});

router.get("/instructors", protect, authorize("ADMIN"), async (req, res) => {
  const instructors = await User.find({ role: "INSTRUCTOR" });
  res.json(instructors);
});

router.delete("/:id", protect, authorize("ADMIN"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.post("/create-instructor", protect, authorize("ADMIN"), async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: "INSTRUCTOR"
  });

  res.json(user);
});

// GET PROFILE
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// UPDATE PROFILE
router.put("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.mobile = req.body.mobile || user.mobile;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  res.json(user);
});


// 🔐 FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset link generated",
    token // (later replace with email link)
  });
});

// 🔐 RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetToken = null;
  user.resetTokenExpire = null;

  await user.save();

  res.json({ message: "Password reset successful" });
});

router.get("/full-data", protect, authorize("ADMIN"), async (req, res) => {
  const users = await User.find().select("-password");
  const courses = await Course.find().populate("assignedInstructor");
  const enrollments = await Enrollment.find().populate("studentId courseId");

  res.json({ users, courses, enrollments });
});


export default router;