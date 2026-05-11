// import InstructorAvailability
// from "../models/InstructorAvailability.js";

// import Class
// from "../models/Class.js";

// import Demo
// from "../models/Demo.js";




// export const saveAvailability =
// async (req, res) => {

//   try {

//     const {
//       workingDays,
//       startHour,
//       endHour,
//       slotDuration
//     } = req.body;

//     let availability =
//       await InstructorAvailability.findOne({
//         instructorId: req.user._id
//       });

//     if (availability) {

//       availability.workingDays =
//         workingDays;

//       availability.startHour =
//         startHour;

//       availability.endHour =
//         endHour;

//       availability.slotDuration =
//         slotDuration;

//       await availability.save();

//     } else {

//       availability =
//         await InstructorAvailability.create({
//           instructorId:
//             req.user._id,

//           workingDays,

//           startHour,

//           endHour,

//           slotDuration
//         });
//     }

//     res.json(availability);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

// export const getAvailability =
// async (req, res) => {

//   try {

//     const availability =
//       await InstructorAvailability.findOne({
//         instructorId: req.user._id
//       });

//     res.json(availability);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

// export const getAvailableSlots =
// async (req, res) => {

//   try {

//     const { date } = req.query;

//     const availability =
//       await InstructorAvailability.findOne({
//         instructorId:
//           req.params.instructorId
//       });

//     if (!availability) {

//       return res.status(404).json({
//         message:
//           "Availability not found"
//       });
//     }

//     const bookedClasses =
//       await Class.find({
//         instructorId:
//           req.params.instructorId,

//         startTime: {
//           $gte: new Date(
//             `${date}T00:00:00`
//           ),

//           $lte: new Date(
//             `${date}T23:59:59`
//           )
//         }
//       });

//     const slots = [];

//     let start =
//       parseInt(
//         availability.startHour.split(":")[0]
//       );

//     let end =
//       parseInt(
//         availability.endHour.split(":")[0]
//       );

//     for (
//       let hour = start;
//       hour < end;
//       hour++
//     ) {

//       const slot =
//         `${hour}:00`;

//       const blocked =
//         bookedClasses.some((cls) => {

//           const bookedHour =
//             new Date(cls.startTime)
//               .getHours();

//           return bookedHour === hour;
//         });

//       if (!blocked) {
//         slots.push(slot);
//       }
//     }

//     res.json(slots);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };




// // ===============================
// // SET AVAILABILITY
// // ===============================

// export const setAvailability =
// async (req, res) => {

//   try {

//     const {
//       workingDays,
//       startHour,
//       endHour,
//       slotDuration
//     } = req.body;

//     // remove old settings
//     await InstructorAvailability.deleteMany({

//       instructorId:
//         req.user._id
//     });

//     // create new settings
//     const availability =
//       await InstructorAvailability.create({

//         instructorId:
//           req.user._id,

//         workingDays,

//         startHour,

//         endHour,

//         slotDuration
//       });

//     res.json(availability);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };



// // ===============================
// // GET AVAILABLE SLOTS
// // ===============================

// export const getSlots =
// async (req, res) => {

//   try {

//     const {
//       instructorId
//     } = req.params;

//     const {
//       date
//     } = req.query;

//     if (!date) {

//       return res.status(400).json({
//         message: "Date required"
//       });
//     }

//     // selected date
//     const selectedDate =
//       new Date(date);

//     // monday/tuesday...
//     const dayName =
//       selectedDate.toLocaleDateString(
//         "en-US",
//         {
//           weekday: "long"
//         }
//       );

//     // availability
//     const availability =
//       await InstructorAvailability.findOne({

//         instructorId
//       });

//     if (!availability) {

//       return res.json([]);
//     }

//     // check working day
//     if (
//       !availability.workingDays.includes(
//         dayName
//       )
//     ) {

//       return res.json([]);
//     }

//     // ===============================
//     // EXISTING TRIAL CLASSES
//     // ===============================

//     const trialClasses =
//       await Demo.find({

//         instructorId,

//         startTime: {

//           $gte: new Date(
//             `${date}T00:00:00`
//           ),

//           $lte: new Date(
//             `${date}T23:59:59`
//           )
//         }
//       });

//     // ===============================
//     // EXISTING NORMAL CLASSES
//     // ===============================

//     const normalClasses =
//       await Class.find({

//         instructorId,

//         startTime: {

//           $gte: new Date(
//             `${date}T00:00:00`
//           ),

//           $lte: new Date(
//             `${date}T23:59:59`
//           )
//         }
//       });

//     // merge all booked
//     const allClasses = [

//       ...trialClasses,

//       ...normalClasses
//     ];

//     // booked hours
//     const bookedSlots =
//       allClasses.map((c) => {

//         const d =
//           new Date(c.startTime);

//         return `${String(
//           d.getHours()
//         ).padStart(2, "0")}:${String(
//           d.getMinutes()
//         ).padStart(2, "0")}`;
//       });

//     // ===============================
//     // GENERATE SLOTS
//     // ===============================

//     let slots = [];

//     const start =
//       parseInt(
//         availability.startHour.split(":")[0]
//       );

//     const end =
//       parseInt(
//         availability.endHour.split(":")[0]
//       );

//     const duration =
//       availability.slotDuration;

//     for (
//       let hour = start;
//       hour < end;
//       hour++
//     ) {

//       for (
//         let min = 0;
//         min < 60;
//         min += duration
//       ) {

//         const slot =
//           `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

//         // skip booked
//         if (
//           !bookedSlots.includes(slot)
//         ) {

//           slots.push(slot);
//         }
//       }
//     }

//     res.json(slots);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };


import InstructorAvailability
from "../models/InstructorAvailability.js";

import Class
from "../models/Class.js";

import Demo
from "../models/Demo.js";

import User from "../models/User.js";

import DemoClass from "../models/DemoClass.js";

// ======================================
// SAVE AVAILABILITY
// ======================================

export const saveAvailability =
async (req, res) => {

  try {

    const {
      workingDays,
      startHour,
      endHour,
      slotDuration
    } = req.body;

    let availability =
      await InstructorAvailability.findOne({

        instructorId:
          req.user._id
      });

    // UPDATE EXISTING
    if (availability) {

      availability.workingDays =
        workingDays;

      availability.startHour =
        startHour;

      availability.endHour =
        endHour;

      availability.slotDuration =
        slotDuration;

      await availability.save();

    }

    // CREATE NEW
    else {

      availability =
        await InstructorAvailability.create({

          instructorId:
            req.user._id,

          workingDays,

          startHour,

          endHour,

          slotDuration
        });
    }

    res.json(availability);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================
// GET MY AVAILABILITY
// ======================================

export const getAvailability =
async (req, res) => {

  try {

    const availability =
      await InstructorAvailability.findOne({

        instructorId:
          req.user._id
      });

    res.json(availability);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================
// GET AVAILABLE SLOTS
// ======================================

export const getAvailableSlots =
async (req, res) => {

  try {

    const {
      instructorId
    } = req.params;

    const {
      date
    } = req.query;

    if (!date) {

      return res.status(400).json({
        message: "Date required"
      });
    }

    // ======================================
    // FIND AVAILABILITY
    // ======================================

    const availability =
      await InstructorAvailability.findOne({

        instructorId
      });

    if (!availability) {

      return res.json([]);
    }

    // ======================================
    // CHECK WORKING DAY
    // ======================================

    const selectedDate =
      new Date(date);

    const dayName =
      selectedDate.toLocaleDateString(
        "en-US",
        {
          weekday: "long"
        }
      );

    if (
      !availability.workingDays.includes(
        dayName
      )
    ) {

      return res.json([]);
    }

    // ======================================
    // FETCH NORMAL CLASSES
    // ======================================

    const normalClasses =
      await Class.find({

        instructorId,

        startTime: {

          $gte: new Date(
            `${date}T00:00:00`
          ),

          $lte: new Date(
            `${date}T23:59:59`
          )
        }
      });

    // ======================================
    // FETCH DEMOS
    // ======================================

    const demos =
      await Demo.find({

        instructorId,

        startTime: {

          $gte: new Date(
            `${date}T00:00:00`
          ),

          $lte: new Date(
            `${date}T23:59:59`
          )
        }
      });

    // ======================================
    // MERGE ALL BOOKED SLOTS
    // ======================================

    const bookedSlots = [];

    [...normalClasses, ...demos]
      .forEach((item) => {

        const d =
          new Date(item.startTime);

        bookedSlots.push(

          `${String(
            d.getHours()
          ).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}`
        );
      });

    // ======================================
    // GENERATE AVAILABLE SLOTS
    // ======================================

    const slots = [];

    let startHour =
      parseInt(
        availability.startHour.split(":")[0]
      );

    let endHour =
      parseInt(
        availability.endHour.split(":")[0]
      );

    const duration =
      availability.slotDuration || 60;

    for (
      let hour = startHour;
      hour < endHour;
      hour++
    ) {

      for (
        let minute = 0;
        minute < 60;
        minute += duration
      ) {

        // const slot =

        //   `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        const totalMinutes =
  hour * 60;

const slotHour =
  Math.floor(totalMinutes / 60);

const slotMinutes =
  totalMinutes % 60;

const slot =
  `${String(slotHour).padStart(2, "0")}:${String(slotMinutes).padStart(2, "0")}`;

        // SKIP BLOCKED
        if (
          !bookedSlots.includes(slot)
        ) {

          slots.push(slot);
        }
      }
    }

    res.json(slots);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// controllers/availabilityController.js

// export const getAvailableInstructorsByDate =
//   async (req, res) => {

//     try {

//       const { date } =
//         req.query;

//       if (!date) {

//         return res.status(400).json({
//           message: "Date required"
//         });
//       }

//       const instructors =
//         await User.find({
//           role: "INSTRUCTOR"
//         });

//       const results = [];

//       for (const instructor of instructors) {

//         // AVAILABILITY
//         const availability =
//           await InstructorAvailability.findOne({
//             instructorId:
//               instructor._id
//           });

//         if (!availability)
//           continue;

//         // DAY NAME
//         const dayName =
//           new Date(date)
//             .toLocaleDateString(
//               "en-US",
//               {
//                 weekday: "long"
//               }
//             );

//         // CHECK WORKING DAY
//         if (
//           !availability.workingDays.includes(
//             dayName
//           )
//         ) {
//           continue;
//         }

//         // ALL SLOTS
//         const slots = [];

//         const startHour =
//           parseInt(
//             availability.startTime.split(":")[0]
//           );

//         const endHour =
//           parseInt(
//             availability.endTime.split(":")[0]
//           );

//         for (
//           let hour = startHour;
//           hour < endHour;
//           hour++
//         ) {

//           const slot =
//             `${String(hour).padStart(2, "0")}:00`;

//           // EXISTING CLASSES
//           const existing =
//             await Class.findOne({
//               instructorId:
//                 instructor._id,
//               startTime: {
//                 $gte:
//                   new Date(`${date}T${slot}`),
//                 $lt:
//                   new Date(`${date}T${hour + 1}:00`)
//               }
//             });

//           if (!existing) {

//             slots.push(slot);
//           }
//         }

//         // ONLY IF SLOTS EXIST
//         if (slots.length > 0) {

//           results.push({

//             instructorId:
//               instructor._id,

//             instructorName:
//               instructor.name,

//             slots
//           });
//         }
//       }

//       res.json(results);

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           "Failed to fetch availability"
//       });
//     }
//   };


// export const getAvailableInstructorsByDate =
//   async (req, res) => {

//     try {

//       const { date } =
//         req.query;

//       const instructors =
//         await User.find({
//           role: "INSTRUCTOR"
//         });

//       const result = [];

//       for (const instructor of instructors) {

//         const availability =
//           await InstructorAvailability.findOne({
//             instructorId:
//               instructor._id
//           });

//         if (!availability)
//           continue;

//         const dayName =
//           new Date(date)
//             .toLocaleDateString(
//               "en-US",
//               {
//                 weekday:
//                   "long"
//               }
//             );

//         if (
//           !availability.workingDays.includes(
//             dayName
//           )
//         ) {
//           continue;
//         }

//         const bookedClasses =
//           await Class.find({
//             instructorId:
//               instructor._id,
//             startTime: {
//               $gte:
//                 new Date(
//                   `${date}T00:00:00`
//                 ),
//               $lte:
//                 new Date(
//                   `${date}T23:59:59`
//                 )
//             }
//           });

//         const bookedSlots =
//           bookedClasses.map(
//             (c) =>
//               new Date(
//                 c.startTime
//               )
//                 .toTimeString()
//                 .slice(0, 5)
//           );

//         const freeSlots =
//           availability.slots.filter(
//             (slot) =>
//               !bookedSlots.includes(
//                 slot
//               )
//           );

//         if (
//           freeSlots.length > 0
//         ) {

//           result.push({

//             instructorId:
//               instructor._id,

//             instructorName:
//               instructor.name,

//             slots:
//               freeSlots
//           });
//         }
//       }

//       res.json(result);

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           "Failed to fetch instructors"
//       });
//     }
//   };


export const getAvailableInstructorsByDate =
  async (req, res) => {

    try {

      const { date } =
        req.query;

      if (!date) {

        return res.status(400).json({
          message: "Date is required"
        });
      }

      const instructors =
        await User.find({
          role: "INSTRUCTOR"
        });

      const result = [];

      for (const instructor of instructors) {

        const availability =
          await InstructorAvailability.findOne({
            instructorId:
              instructor._id
          });

        if (!availability)
          continue;

        // DAY NAME
        const dayName =
          new Date(date)
            .toLocaleDateString(
              "en-US",
              {
                weekday:
                  "long"
              }
            );

        // CHECK WORKING DAY
        if (
          !availability.workingDays.includes(
            dayName
          )
        ) {
          continue;
        }

        // BOOKED CLASSES
        // const bookedClasses =
        //   await Class.find({
        //     instructorId:
        //       instructor._id,

        //     startTime: {
        //       $gte:
        //         new Date(
        //           `${date}T00:00:00`
        //         ),

        //       $lte:
        //         new Date(
        //           `${date}T23:59:59`
        //         )
        //     }
        //   });

        const bookedClasses =
  await DemoClass.find({

    instructorId:
      instructor._id,

    startTime: {
      $gte:
        new Date(
          `${date}T00:00:00`
        ),

      $lte:
        new Date(
          `${date}T23:59:59`
        )
    },

    status: {
      $in: [
        "SCHEDULED"
      ]
    }
  });

        // BOOKED SLOTS
        const bookedSlots =
          bookedClasses.map(
            (c) =>
              new Date(
                c.startTime
              )
                .toTimeString()
                .slice(0, 5)
          );

        // GENERATE FREE SLOTS
//         const freeSlots = [];

//         const start =
//           parseInt(
//             availability.startHour.split(":")[0]
//           );

//         const end =
//           parseInt(
//             availability.endHour.split(":")[0]
//           );

//         const duration =
//           availability.slotDuration || 60;

//         // for (
//         //   let hour = start;
//         //   hour < end;
//         //   hour += duration / 60
//         // )
        
//        for (
//   let hour = start;
//   hour < end;
//   hour += duration / 60
// ) {

//           const slot =
//             `${String(hour).padStart(2, "0")}:00`;

//           if (
//             !bookedSlots.includes(
//               slot
//             )
//           ) {

//             freeSlots.push(slot);
//           }
//         }

const freeSlots = [];

const start =
  parseInt(
    availability.startHour.split(":")[0]
  );

const end =
  parseInt(
    availability.endHour.split(":")[0]
  );

const duration =
  availability.slotDuration || 60;

for (
  let hour = start;
  hour < end;
  hour += duration / 60
) {

  const totalMinutes =
    hour * 60;

  const slotHour =
    Math.floor(
      totalMinutes / 60
    );

  const slotMinutes =
    totalMinutes % 60;

  const slot =
    `${String(slotHour).padStart(2, "0")}:${String(slotMinutes).padStart(2, "0")}`;

  if (
    !bookedSlots.includes(slot)
  ) {

    freeSlots.push(slot);
  }
}

        // PUSH RESULT
        if (
          freeSlots.length > 0
        ) {

          result.push({

            instructorId:
              instructor._id,

            instructorName:
              instructor.name,

            slots:
              freeSlots
          });
        }
      }

      res.json(result);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch instructors"
      });
    }
  };