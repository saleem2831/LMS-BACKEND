export const demoScheduledTemplate = ({
  studentName,
  courseName,
  instructorName,
  scheduledTime,
  meetLink,
  notes
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
      
      <div style="background:#0ea5e9; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">Skillstek</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111;">Demo Class Scheduled 🎯</h2>

        <p style="color:#555;">
          Hi <b>${studentName}</b>,
        </p>

        <p style="color:#555;">
          Your demo class for <b>${courseName}</b> has been successfully scheduled.
        </p>

        <table style="width:100%; margin:20px 0; font-size:14px; color:#444;">
          <tr>
            <td><b>Instructor:</b></td>
            <td>${instructorName}</td>
          </tr>
          <tr>
            <td><b>Date & Time:</b></td>
            <td>${new Date(scheduledTime).toLocaleString()}</td>
          </tr>
        </table>

        ${
          notes
            ? `<p style="color:#555;"><b>Notes:</b> ${notes}</p>`
            : ""
        }

        <div style="text-align:center; margin:30px 0;">
          <a href="${meetLink}"
             style="background:#0ea5e9; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
            Join Demo Class
          </a>
        </div>

        <p style="color:#999; font-size:13px;">
          Please join 5 minutes before the scheduled time.
        </p>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        All the best for your learning journey 🚀
      </div>

    </div>
  </div>
  `;
};