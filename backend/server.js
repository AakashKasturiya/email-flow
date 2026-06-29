import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { saveEmail, getEmails, deleteEmail, clearEmails } from "./storage.js";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import path from "path";

// Routes
import templateRoutes from "./routes/templates.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ----------------------
// 🔥 MONGODB CONNECTION
// ----------------------
mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/email_app")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ----------------------
// 📁 STATIC FILES (Images)
// ----------------------
// serve template images folder (public/images)
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// templates routes
app.use("/api/templates", templateRoutes);

// simple health check
app.get("/", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


// ----------------------
// 📌 MULTER UPLOAD SETUP
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ----------------------
// 📌 SEND EMAIL
// ----------------------
app.post("/send-email", upload.single("pdf"), async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const emailId = uuidv4();

    // Insert download link into user’s button
    const finalHTML = text.replace(
      /<a([^>]*)>Download Detailed Report<\/a>/i,
      `<a$1 href="http://localhost:5000/download-email-pdf?id=${emailId}">Download Detailed Report</a>`
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });

    const attachments = [];
    if (req.file) {
      attachments.push({ filename: req.file.filename, path: req.file.path });
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: finalHTML,
      attachments,
    });

    saveEmail({
      id: emailId,
      to,
      subject,
      html: finalHTML,
      status: "delivered",
      date: new Date(),
    });

    res.json({ message: "Email sent successfully!", id: emailId });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ message: "Email sending failed" });
  }
});

// ----------------------
// 📌 GET EMAIL LOGS
// ----------------------
app.get("/emails", (req, res) => {
  res.json(getEmails());
});

// ----------------------
// 📌 DOWNLOAD EMAIL PDF
// ----------------------
app.get("/download-email-pdf", async (req, res) => {
  try {
    const { id } = req.query;
    const email = getEmails().find((e) => e.id === id);
    if (!email) return res.status(404).send("Email not found");

    const htmlForPDF = email.html.replace(
      /<a(?![^>]*email-download-btn)[^>]*>Download Detailed Report<\/a>/gi,
      ""
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlForPDF, { waitUntil: "networkidle0" });

    const bodyHandle = await page.$("body");
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    const pdfBuffer = await page.pdf({
      width: "210mm",
      height: `${height + 40}px`,
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="email-${id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});

// ----------------------
// 📌 DELETE LOG
// ----------------------
app.delete("/emails/:id", async (req, res) => {
  await deleteEmail(req.params.id);
  res.json({ success: true });
});

// clear all email logs
app.delete("/emails", async (req, res) => {
  await clearEmails();
  res.json({ success: true });
});



