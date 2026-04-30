import Batch from "../models/Batch.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js"; 
import Notification from "../models/Notification.js";




export const createBatch = async (req, res) => {
  const { courseId, students } = req.body;

  const batch = await Batch.create({
    courseId,
    instructorId: req.user._id,
    students
  });

  res.json(batch);
};


// export const createClass = async (req, res) => {
//   try {
//     const {
//       type,
//       courseId,
//       students,
//       batchId,
//       startTime,
//       endTime
//     } = req.body;

//     // 🔥 SIMPLE MEET LINK (TEMP)
//     const meetLink = "https://meet.google.com/" + Math.random().toString(36).substring(7);

//     const newClass = await Class.create({
//       type,
//       courseId,
//       instructorId: req.user._id,
//       students,
//       batchId,
//       startTime,
//       endTime,
//       meetLink
//     });

//     res.json(newClass);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const getClasses = async (req, res) => {
//   const userId = req.user._id;

//   const classes = await Class.find({
//     $or: [
//       { instructorId: userId },
//       { students: userId }
//     ]
//   });

//   res.json(classes);
// };


// export const createClass = async (req, res) => {
//   try {
//     const { type, courseId, batchId, startTime, endTime } = req.body;

//     const meetLink =
//       "https://meet.google.com/" +
//       Math.random().toString(36).substring(7);

//     const newClass = await Class.create({
//       type,
//       courseId,
//       instructorId: req.user._id,
//       batchId,
//       startTime,
//       endTime,
//       meetLink
//     });

//     res.json(newClass);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



export const createClass = async (req, res) => {
  try {
    const {
      type,
      courseId,
      batchId,
      startTime,
      endTime,
      meetLink,
      studentId // only for 1:1
    } = req.body;

    // ✅ 1. VALIDATION
    if (!courseId || !startTime || !meetLink) {
      return res.status(400).json({
        message: "courseId, startTime and meetLink are required"
      });
    }

    // ✅ 2. CHECK COURSE EXISTS
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ 3. CHECK INSTRUCTOR IS ASSIGNED
    if (
      course.assignedInstructor &&
      course.assignedInstructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not assigned to this course"
      });
    }

    // ✅ 4. HANDLE STUDENTS
    let students = [];

    if (type === "ONE_TO_ONE") {
      if (!studentId) {
        return res.status(400).json({
          message: "studentId required for 1:1 class"
        });
      }

      students = [studentId];
    } else if (type === "BATCH") {
      const enrollments = await Enrollment.find({ courseId });
      students = enrollments.map(e => e.studentId);
    }

    // ✅ 5. CREATE CLASS
    const newClass = await Class.create({
      type,
      courseId,
      instructorId: req.user._id,
      batchId: batchId || null,
      students,
      startTime,
      endTime,
      meetLink
    });

    res.json(newClass);

//     for (let student of students) {
//   await Notification.create({
//     userId: student,
//     message: `New class scheduled for course`
//   });
// }

for (let student of students) {
  await Notification.create({
    userId: student,
    message: `Class scheduled at ${new Date(startTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    })}`
  });
}

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getClasses = async (req, res) => {
//   const userId = req.user._id;

//   let classes;

//   // Instructor → sees their classes
//   if (req.user.role === "INSTRUCTOR") {
//     classes = await Class.find({ instructorId: userId });
//   }

//   // Student → only enrolled course classes
//   if (req.user.role === "STUDENT") {
//     const enrollments = await Enrollment.find({ studentId: userId });

//     const courseIds = enrollments.map(e => e.courseId);

//     classes = await Class.find({
//       courseId: { $in: courseIds }
//     });
//   }

//   res.json(classes);
// };


// export const getClasses = async (req, res) => {
//   try {
//     let classes = [];

//     if (req.user.role === "INSTRUCTOR") {
//       classes = await Class.find({
//         instructorId: req.user._id
//       }).populate("courseId", "title");
//     }

//     if (req.user.role === "STUDENT") {
//       const enrollments = await Enrollment.find({
//         studentId: req.user._id
//       });

//       const courseIds = enrollments.map(e => e.courseId);

//       classes = await Class.find({
//         courseId: { $in: courseIds }
//       }).populate("courseId", "title");
//     }

//     if (req.user.role === "ADMIN") {
//       classes = await Class.find().populate("courseId", "title");
//     }



//     res.json(classes); // ✅ ALWAYS ARRAY

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getClasses = async (req, res) => {
  try {

// console.log("NOW:", now);
// console.log("TWO HOURS AGO:", twoHoursAgo);
    let classes;

    if (req.user.role === "INSTRUCTOR") {
      classes = await Class.find({
        instructorId: req.user._id
      }).populate("courseId", "title");
    }

    if (req.user.role === "STUDENT") {
      const enrollments = await Enrollment.find({
        studentId: req.user._id
      });

      const courseIds = enrollments.map(e => e.courseId);

      classes = await Class.find({
        courseId: { $in: courseIds }
      }).populate("courseId", "title");
    }

    if (req.user.role === "ADMIN") {
      classes = await Class.find().populate("courseId", "title");
    }

    // res.json(classes);
     // ✅ ADD THIS BLOCK HERE (IMPORTANT)
    const updatedClasses = classes.map(c => {
      const start = new Date(c.startTime);

      const endTime = new Date(
        start.getTime() + 2 * 60 * 60 * 1000
      );

      const status =
        new Date() >= endTime ? "COMPLETED" : "UPCOMING";

      return {
        ...c.toObject(),
        status
      };
    });

    // ✅ RETURN UPDATED DATA
    res.json(updatedClasses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};