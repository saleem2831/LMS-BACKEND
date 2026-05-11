export const registerTemplate = (name) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
      
      <div style="background:#4f46e5; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">Skillstek</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111;">Welcome, ${name} 👋</h2>
        <p style="color:#555; font-size:15px;">
          Your account has been successfully created.
        </p>

        <p style="color:#555; font-size:15px;">
          You can now explore courses, start learning, and grow your skills 🚀
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="http://localhost:5173/student"
             style="background:#4f46e5; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
            Go to Dashboard
          </a>
        </div>

        <p style="color:#999; font-size:13px;">
          If you did not create this account, please ignore this email.
        </p>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Skillstek. All rights reserved.
      </div>

    </div>
  </div>
  `;
};