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
  curriculumInsPdf: String, // S3 URL

  image: String,   
  
  trialEnabled: {
  type: Boolean,
  default: true
},// NEW

  pricing: {
    oneToOne: Number,
    batch: Number,
    trial: Number
  },


  assignedInstructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

assignedInstructors: [
  {
    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  }
],

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);