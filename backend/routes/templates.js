// backend/routes/templates.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from "../controllers/templatesController.js";

const router = express.Router();

// Serve images from public/images folder
router.use("/templates", express.static(path.join("public/images/templates")));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/templates"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// Routes
router.get("/", getAllTemplates); // GET all templates
router.get("/:id", getTemplateById); // GET template by ID
router.post("/", upload.single("image"), createTemplate); // Create new template with image
router.put("/:id", upload.single("image"), updateTemplate); // Update template (with optional image)
router.delete("/:id", deleteTemplate); // Delete template

export default router;
