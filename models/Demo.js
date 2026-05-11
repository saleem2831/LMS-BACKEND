import mongoose from "mongoose";

const demoSchema = new mongoose.Schema(
  {
    trialEnrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrialEnrollment"
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    scheduledTime: Date,

    duration: {
      type: Number,
      default: 60
    },

    meetLink: String,

    notes: String,

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "SCHEDULED"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Demo", demoSchema);