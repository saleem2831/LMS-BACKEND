import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, oneToOne, batch } = req.body;

    let pdfUrl = "";
    let imageUrl = "";

    if (req.files?.curriculumPdf) {
      pdfUrl = req.files.curriculumPdf[0].location;
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
      image: imageUrl,
      pricing: {
        oneToOne,
        batch
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

export const getCourses = async (req, res) => {
  try {
    let courses;

    // ✅ ADMIN → see all courses with instructor name
    if (req.user && req.user.role === "ADMIN") {
      courses = await Course.find()
        .populate("createdBy", "name")
        .populate("assignedInstructor", "name"); // ✅ ADD HERE
    } 
    // ✅ STUDENT / PUBLIC → only approved courses
    else {
      courses = await Course.find({ status: "approved" })
        .populate("assignedInstructor", "name"); // optional but good
    }

    res.json(courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const assignInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.assignedInstructor = instructorId;

    await course.save();

    // ✅ RETURN UPDATED COURSE WITH NAME
    const updated = await Course.findById(course._id)
      .populate("assignedInstructor", "name");

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};