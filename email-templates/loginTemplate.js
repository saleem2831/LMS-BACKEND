export const loginTemplate = (name, email) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px;">
      
      <div style="background:#22c55e; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">Skillstek</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111;">New Login Detected 🔐</h2>

        <p style="color:#555;">
          Hi <b>${name}</b>,
        </p>

        <p style="color:#555;">
          Your account (<b>${email}</b>) was just logged in.
        </p>

        <p style="color:#555;">
          If this was you, you can safely ignore this email.
        </p>

        <p style="color:#d32f2f;">
          If this wasn't you, please reset your password immediately.
        </p>

        <div style="text-align:center; margin:25px 0;">
          <a href="http://localhost:5173/forgot-password"
             style="background:#ef4444; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
            Reset Password
          </a>
        </div>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        Stay secure with Skillstek 🔒
      </div>

    </div>
  </div>
  `;
};