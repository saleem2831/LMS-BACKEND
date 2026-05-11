import mongoose from "mongoose";

const instructorAvailabilitySchema =
  new mongoose.Schema(
    {
      instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      workingDays: [
        {
          type: String
        }
      ],

      startHour: {
        type: String,
        required: true
      },

      endHour: {
        type: String,
        required: true
      },

      slotDuration: {
        type: Number,
        default: 60
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "InstructorAvailability",
  instructorAvailabilitySchema
);