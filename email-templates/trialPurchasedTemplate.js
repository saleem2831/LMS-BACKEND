export const trialPurchasedTemplate = ({
  studentName,
  courseName,
  amount,
  paymentId
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
      
      <div style="background:#f59e0b; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">Skillstek</h1>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#111;">Trial Activated 🎯</h2>

        <p style="color:#555;">
          Hi <b>${studentName}</b>,
        </p>

        <p style="color:#555;">
          Your trial for <b>${courseName}</b> has been successfully activated.
        </p>

        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
          <p><b>Amount Paid:</b> ₹${amount}</p>
          <p><b>Payment ID:</b> ${paymentId}</p>
          <p><b>Status:</b> Pending Demo Scheduling</p>
        </div>

        <p style="color:#555;">
          Our team will schedule your demo session soon. Stay tuned 📅
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="http://localhost:5173/student"
             style="background:#f59e0b; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
            Go to Dashboard
          </a>
        </div>

        <p style="color:#999; font-size:13px;">
          Need help? Contact our support anytime.
        </p>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        Let's start your learning journey 🚀
      </div>

    </div>
  </div>
  `;
};