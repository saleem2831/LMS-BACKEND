import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  creatorRole: {
    type: String,
    enum: ["ADMIN", "INSTRUCTOR"]
  },

  status: {
    type: String,
    enum: ["draft", "pending", "approved"],
    default: "draft"
  },

  curriculumPdf: String, // S3 URL
  image: String,         // NEW

  pricing: {
    oneToOne: Number,
    batch: Number
  },

  assignedInstructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);