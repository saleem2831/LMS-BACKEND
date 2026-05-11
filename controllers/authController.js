import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendEmail } from "../utils/sendEmail.js";
import { loginTemplate } from "../email-templates/loginTemplate.js";
import { registerTemplate } from "../email-templates/registerTemplate.js";


// Generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    "secretkey",
    { expiresIn: "7d" }
  );
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT" 

    });

       // ✅ Send Welcome Email
    // await sendEmail(
    //   email,
    //   "Welcome to Skillstek 🎉",
    //   registerTemplate(name)
    // );


    res.json({
      token: generateToken(user),
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

      // ✅ Send Login Alert Email
    // await sendEmail(
    //   user.email,
    //   "New Login Alert 🔐",
    //   loginTemplate(user.name, user.email)
    // );

    res.json({
      token: generateToken(user),
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};