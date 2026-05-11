// import express from "express";

// import {
//   saveAvailability,
//   getAvailability,
//   getAvailableSlots
// } from "../controllers/availabilityController.js";


// import {
//   setAvailability,
//   getAvailabilitySlots
// } from "../controllers/availabilityController.js";

// import {
//   protect,
//   authorize
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post(
//   "/",
//   protect,
//   authorize("INSTRUCTOR"),
//   saveAvailability
// );

// router.get(
//   "/my",
//   protect,
//   authorize("INSTRUCTOR"),
//   getAvailability
// );

// router.get(
//   "/slots/:instructorId",
//   protect,
//   getAvailableSlots
// );

// export default router;


import express from "express";

import {
  saveAvailability,
  getAvailability,
  getAvailableSlots, getAvailableInstructorsByDate
} from "../controllers/availabilityController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();


// SAVE AVAILABILITY
router.post(
  "/",
  protect,
  authorize("INSTRUCTOR"),
  saveAvailability
);


// GET MY AVAILABILITY
router.get(
  "/my",
  protect,
  authorize("INSTRUCTOR"),
  getAvailability
);


// GET AVAILABLE SLOTS
router.get(
  "/slots/:instructorId",
  protect,
  getAvailableSlots
);

router.get(
  "/instructor/:instructorId",
  protect,
  async (req, res) => {

    try {

      const availability =
        await InstructorAvailability.findOne({

          instructorId:
            req.params.instructorId
        });

      res.json(availability);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

router.get(
  "/date-slots",
  getAvailableInstructorsByDate
);

export default router;