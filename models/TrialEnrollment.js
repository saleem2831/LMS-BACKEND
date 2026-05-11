import mongoose from "mongoose";

const trialEnrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },

    paymentId: String,

    amount: Number,

    // status: {
    //   type: String,
    //   enum: [
    //     "PENDING",
    //     "SCHEDULED",
    //     "COMPLETED",
    //     "CONVERTED"
    //   ],
    //   default: "PENDING"
    // },

    status: {
  type: String,

  enum: [
    "PENDING",
    "SCHEDULED",
    "COMPLETED",
    "INTERESTED",
    "NOT_INTERESTED",
    "CONVERTED"
  ],

  default: "PENDING"
},

    demoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demo"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "TrialEnrollment",
  trialEnrollmentSchema
);