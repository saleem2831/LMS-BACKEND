

// // import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.hostinger.com",
// //   port: 465,
// //   secure: true, // SSL
// //   auth: {
// //     user: process.env.EMAIL_USER, // sales@skillstek.in
// //     pass: process.env.EMAIL_PASS  // your password
// //   }
// // });


// // const transporter = nodemailer.createTransport({
// //   host: "smtp.hostinger.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: String(process.env.EMAIL_USER).trim(),
// //     pass: String(process.env.EMAIL_PASS).trim()
// //   },
// //   authMethod: "LOGIN" // 🔥 IMPORTANT FIX
// // });


// // export const sendEmail = async (to, subject, html) => {
// //     console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
// //   try {
// //     const info = await transporter.sendMail({
// //       from: `"Skillstek" <${process.env.EMAIL_USER}>`,
// //       to,
// //       subject,
// //       html
// //     });

// //     console.log("Email sent:", info.messageId);
// //   } catch (error) {
// //     console.error("Email error:", error);
// //   }
// // };


// import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.hostinger.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: String(process.env.EMAIL_USER).trim(),
// //     pass: String(process.env.EMAIL_PASS).trim()
// //   },
// //   authMethod: "LOGIN"
// // });


// const transporter = nodemailer.createTransport({
//   host: "smtp.hostinger.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   debug: true,   // 👈 ADD
//   logger: true   // 👈 ADD
// });


// export const sendEmail = async (to, subject, html) => {
//   try {
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);

//     await transporter.verify();
//     console.log("✅ SMTP Connected");

//     const info = await transporter.sendMail({
//       from: `"Skillstek" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });

//     console.log("✅ Email sent:", info.messageId);

//   } catch (error) {
//     console.error("❌ Email error:", error);
//   }
// };



// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, html) => {
//   try {
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     const info = await transporter.sendMail({
//       from: `"Skillstek" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });

//     console.log("✅ Email sent:", info.messageId);

//   } catch (error) {
//     console.error("❌ Email error:", error);
//   }
// };


import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"Skillstek" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};