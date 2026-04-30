import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["ADMIN", "INSTRUCTOR", "STUDENT"],
    default: "STUDENT"
  },

  approved: {
    type: Boolean,
    default: true // you can later make instructor approval required
  },

  mobile: String,
 address: String,
 resetToken: String,
resetTokenExpire: Date,

}, { timestamps: true });

export default mongoose.model("User", userSchema);