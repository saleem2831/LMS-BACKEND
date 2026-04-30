import mongoose from "mongoose";

// const classSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["ONE_TO_ONE", "BATCH"]
//   },

//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course"
//   },

//   instructorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   students: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     }
//   ],

//   batchId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Batch"
//   },

//   startTime: Date,
//   endTime: Date,

//   meetLink: String

// }, { timestamps: true });

const classSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["ONE_TO_ONE", "BATCH"]
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  },

  startTime: Date,
  endTime: Date,

  meetLink: String,

  status: {
  type: String,
  enum: ["UPCOMING", "COMPLETED"],
  default: "UPCOMING"
}

}, { timestamps: true });

export default mongoose.model("Class", classSchema);