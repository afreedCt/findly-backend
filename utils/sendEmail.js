import nodemailer from "nodemailer";

// { to, subject, html }
export const sendEmail = async ({ from,to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can also use "Outlook", "Yahoo", or custom SMTP
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password (not normal password!)
    },
  });
  //   console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  try {
    const info = await transporter.sendMail({
      // from: `"Findly Team" <${process.env.EMAIL_USER}>`,
      from,
      to,
      subject,
      html,
    });
    // console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    // console.error("❌ Email error:", error);
  }
};
