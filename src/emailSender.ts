// emailSender.ts
import nodemailer from "nodemailer";

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 25,
    secure: false,
    auth: {
      user: "admin",
      pass: "password",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "Hello from Nodemailer!",
    text: "This is a test email sent using Nodemailer and SMTP server.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendEmail();
