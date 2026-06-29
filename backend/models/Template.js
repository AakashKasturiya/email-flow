// backend/models/Template.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "marketing" },
  description: { type: String },
  image: { type: String }, // stored as URL/path (e.g., /images/xxx.png)
  html: { type: String },
  usedCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Template", templateSchema, "emailtemplates");
