import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  plan: {
    type: String,
    enum: ["ONE_TO_ONE", "BATCH"]
  },

  paymentId: String,

  status: {
    type: String,
    default: "paid"
  }

}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);