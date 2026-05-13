import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import trialRoutes from "./routes/trialRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());


// const allowedOrigins = [
//   "http://localhost:5173", // local Vite frontend
//   "https://lms-frontend-rho-nine.vercel.app/" // replace with your real Vercel URL
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (like Postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lms-frontend-rho-nine.vercel.app",
    "https://skillstek.in/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// app.options("*", cors());


// Static folder for uploads
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/demos", demoRoutes);
app.use("/api/trials", trialRoutes);
app.use(
  "/api/sales",
  salesRoutes
);


app.use(
  "/api/instructor",
  instructorRoutes
);
app.use(
  "/api/availability",
  availabilityRoutes
);









// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});