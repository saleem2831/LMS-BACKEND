// import express from "express";

// import {
//   createDemo,
//   getDemos,
//   updateDemoStatus
// } from "../controllers/demoController.js";

// import {
//   protect,
//   authorize
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // SALES + ADMIN
// router.post(
//   "/",
//   protect,
//   authorize("ADMIN", "SALES"),
//   createDemo
// );

// // ADMIN + SALES + INSTRUCTOR
// router.get(
//   "/",
//   protect,
//   authorize("ADMIN", "SALES", "INSTRUCTOR"),
//   getDemos
// );

// router.put(
//   "/:id/status",
//   protect,
//   authorize("ADMIN", "SALES"),
//   updateDemoStatus
// );

// export default router;


import express from "express";

import {
  scheduleDemo,
  getDemos
} from "../controllers/demoController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/schedule",
  protect,
  authorize("ADMIN", "SALES"),
  scheduleDemo
);

router.get(
  "/",
  protect,
  authorize(
    "ADMIN",
    "SALES",
    "INSTRUCTOR"
  ),
  getDemos
);

export default router;