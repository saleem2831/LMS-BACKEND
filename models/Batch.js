import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

export default mongoose.model("Batch", batchSchema);