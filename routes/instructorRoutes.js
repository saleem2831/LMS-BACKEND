import express from "express";

import DemoClass from
"../models/DemoClass.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();


// router.get(
//   "/trial-classes",

//   protect,

//   authorize("INSTRUCTOR"),

//   async (req, res) => {

//     try {

//       // AUTO COMPLETE OLD CLASSES

//       await DemoClass.updateMany(

//         {
//           instructorId:
//             req.user._id,

//           endTime: {
//             $lt: new Date()
//           },

//           status:
//             "SCHEDULED"
//         },

//         {
//           status:
//             "COMPLETED"
//         }
//       );

//       // FETCH CLASSES

//       const classes =
//         await DemoClass.find({

//           instructorId:
//             req.user._id
//         })

//         .populate(
//           "studentId",
//           "name email"
//         )

//         .populate(
//           "courseId",
//           "title"
//         )

//         .sort({
//           startTime: 1
//         });

//       res.json(classes);

//     } catch (error) {

//       res.status(500).json({
//         message:
//           error.message
//       });
//     }
//   }
// );


router.get(
  "/trial-classes",

  protect,

  authorize("INSTRUCTOR"),

  async (req, res) => {

    try {

      const classes =
        await DemoClass.find({

          instructorId:
            req.user._id
        })

        .populate(
          "studentId",
          "name email"
        )

        .populate(
          "courseId",
          "title"
        )

        .sort({
          startTime: 1
        });

      res.json(classes);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });
    }
  }
);

export default router;