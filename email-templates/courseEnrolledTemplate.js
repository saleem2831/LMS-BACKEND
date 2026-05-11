export const courseEnrolledTemplate = ({
  studentName,
  courseName,
  plan,
  paymentId
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
      
      <div style="background:#16a34a; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">Skillstek</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111;">Enrollment Confirmed 🎉</h2>

        <p style="color:#555;">
          Hi <b>${studentName}</b>,
        </p>

        <p style="color:#555;">
          Your payment was successful and you are now enrolled in:
        </p>

        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
          <p><b>Course:</b> ${courseName}</p>
          <p><b>Plan:</b> ${plan}</p>
          <p><b>Payment ID:</b> ${paymentId}</p>
        </div>

        <div style="text-align:center; margin:30px 0;">
          <a href="http://localhost:5173/student"
             style="background:#16a34a; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
            Start Learning
          </a>
        </div>

        <p style="color:#555;">
          We're excited to have you onboard. Happy learning 🚀
        </p>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Skillstek
      </div>

    </div>
  </div>
  `;
};