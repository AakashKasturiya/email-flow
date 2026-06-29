import nodemailer from "nodemailer";
import fs from "fs";

export async function sendEmail(to, subject, html, file) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const attachments = [];

    if (file) {
      attachments.push({
        filename: file.originalname,
        path: file.path
      });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
      attachments
    });

    console.log("📨 Email sent:", info.messageId);

    if (file) fs.unlinkSync(file.path);
  } catch (err) {
    console.error("❌ MAILER ERROR:", err);
    throw err;
  }
}
