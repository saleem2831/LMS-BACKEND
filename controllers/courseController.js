import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {


    const { title, description, oneToOne, batch, trial } = req.body;



    let pdfUrl = "";
    let pdfUrlIns = "";
    let imageUrl = "";

    if (req.files?.curriculumPdf) {
      pdfUrl = req.files.curriculumPdf[0].location;
    }

      if (req.files?.curriculumInsPdf) {
      pdfUrlIns = req.files.curriculumInsPdf[0].location;
    }

    if (req.files?.image) {
      imageUrl = req.files.image[0].location;
    }

    let status = "pending";

    if (req.user.role === "ADMIN") {
      status = "approved";
    }

    const course = await Course.create({
      title,
      description,
      createdBy: req.user._id,
      creatorRole: req.user.role,
      status,
      curriculumPdf: pdfUrl,
      curriculumInsPdf: pdfUrlIns,
      image: imageUrl,
      pricing: {
        oneToOne,
        batch,
        trial,
      }
    });



    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// export const getCourses = async (req, res) => {
//   try {
//     let courses;

//     if (req.user.role === "ADMIN") {
//       courses = await Course.find().populate("createdBy", "name email");
//     } else {
//       courses = await Course.find({ status: "approved" });
//     }

//     res.json(courses);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const getCourses = async (req, res) => {
//   try {
//     let courses;

//     // If user exists and is admin
//     if (req.user && req.user.role === "ADMIN") {
//       courses = await Course.find().populate("createdBy", "name");
//     } else {
//       // Public + students → only approved
//       courses = await Course.find({ status: "approved" });
//     }

//     res.json(courses);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getCourses = async (req, res) => {
//   const courses = await Course.find({ status: "approved" });
//   res.json(courses);
// };

// export const getCourses = async (req, res) => {
//   try {
//     let courses;

//     // ✅ ADMIN → see all courses with instructor name
//     if (req.user && req.user.role === "ADMIN") {
//       courses = await Course.find()
//         .populate("createdBy", "name")
//         .populate("assignedInstructor", "name"); // ✅ ADD HERE
//     } 
//     // ✅ STUDENT / PUBLIC → only approved courses
//     else {
//       courses = await Course.find({ status: "approved" })
//         .populate("assignedInstructor", "name"); // optional but good
//     }

//     res.json(courses);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const getCourses = async (
  req,
  res
) => {

  try {

    let courses;

    // ADMIN
    if (
      req.user &&
      req.user.role === "ADMIN"
    ) {

      courses = await Course.find()

        .populate(
          "createdBy",
          "name email"
        )

        .populate(
          "assignedInstructors",
          "name email"
        );

    }

    // PUBLIC / STUDENT
    else {

      courses = await Course.find({
        status: "approved"
      })

      .populate(
        "assignedInstructors",
        "name email"
      );
    }

    res.json(courses);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

export const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.status = "approved";
    await course.save();

    res.json({ message: "Course approved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const assignInstructor = async (req, res) => {
//   try {
//     const { instructorId } = req.body;

//     const course = await Course.findById(req.params.id);
//     // const courses = await Course.find().populate("assignedInstructor", "name");

//     course.assignedInstructor = instructorId;

//     await course.save();

//     res.json({ message: "Instructor assigned" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const assignInstructor = async (req, res) => {
//   try {
//     const { instructorId } = req.body;

//     const course = await Course.findById(req.params.id);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     course.assignedInstructor = instructorId;

//     await course.save();

//     // ✅ RETURN UPDATED COURSE WITH NAME
//     const updated = await Course.findById(course._id)
//       .populate("assignedInstructor", "name");

//     res.json(updated);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const assignInstructor =
async (req, res) => {

  try {

    const {
      instructorId
    } = req.body;

    const course =
      await Course.findById(
        req.params.id
      );

    if (!course) {

      return res.status(404)
        .json({
          message:
            "Course not found"
        });
    }

    // ✅ OLD FIELD
    // keeps existing LMS stable

    course.assignedInstructor =
      instructorId;

    // ✅ NEW ARRAY FIELD

    if (
      !course.assignedInstructors
    ) {

      course.assignedInstructors = [];
    }

    // ✅ PREVENT DUPLICATES

    const alreadyExists =
      course.assignedInstructors
        .some(

          (id) =>

            id.toString()

            ===

            instructorId
        );

    if (!alreadyExists) {

      course.assignedInstructors
        .push(instructorId);
    }

    await course.save();

    // ✅ RETURN UPDATED COURSE

    const updated =
      await Course.findById(
        course._id
      )

      .populate(
        "assignedInstructor",
        "name email"
      )

      .populate(
        "assignedInstructors",
        "name email"
      );

    res.json(updated);

  } catch (error) {

    res.status(500).json({

      message:
        error.message
    });
  }
};


// export const removeInstructor =
// async (req, res) => {

//   try {

//     const {
//       instructorId
//     } = req.body;

//     const course =
//       await Course.findById(
//         req.params.courseId
//       );

//     if (!course) {

//       return res.status(404)
//         .json({
//           message:
//             "Course not found"
//         });
//     }

//     course.assignedInstructors =
//       course.assignedInstructors
//         .filter(

//           (id) =>

//             id.toString()

//             !==

//             instructorId
//         );

//     // OLD FIELD SUPPORT

//     if (

//       course.assignedInstructor
//       ?.toString()

//       ===

//       instructorId

//     ) {

//       course.assignedInstructor =
//         null;
//     }

//     await course.save();

//     res.json({
//       message:
//         "Instructor removed"
//     });

//   } catch (error) {

//     res.status(500).json({

//       message:
//         error.message
//     });
//   }
// };



export const removeInstructor =
async (req, res) => {

  try {

    const {
      instructorId
    } = req.body;

    const course =
      await Course.findById(
        req.params.courseId
      );

    if (!course) {

      return res.status(404)
        .json({
          message:
            "Course not found"
        });
    }

    // REMOVE FROM ARRAY

    course.assignedInstructors =
      course.assignedInstructors
        .filter(

          (id) =>

            id.toString()

            !==

            instructorId
        );

    // OLD FIELD SUPPORT

    if (

      course.assignedInstructor
      ?.toString()

      ===

      instructorId

    ) {

      course.assignedInstructor =
        null;
    }

    await course.save();

    // ✅ FETCH UPDATED COURSE

    const updatedCourse =
      await Course.findById(
        course._id
      )

      .populate(
        "assignedInstructor",
        "name email"
      )

      .populate(
        "assignedInstructors",
        "name email"
      );

    res.json(updatedCourse);

  } catch (error) {

    res.status(500).json({

      message:
        error.message
    });
  }
};


export const getCourseById =
  async (req, res) => {

    try {

      const course =
        await Course.findById(
          req.params.id
        );

      if (!course) {

        return res.status(404).json({
          message:
            "Course not found"
        });
      }

      res.json(course);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  };