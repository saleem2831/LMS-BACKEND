import mongoose from "mongoose";

const demoClassSchema =
  new mongoose.Schema(
    {

      trialEnrollmentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "TrialEnrollment"
      },

      studentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      instructorId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      salesId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      courseId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },

      startTime: Date,

      endTime: Date,

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

export default mongoose.model(
  "DemoClass",
  demoClassSchema
);