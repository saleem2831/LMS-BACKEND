import Enrollment from "../models/Enrollment.js";

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user._id
    }).populate("courseId");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};