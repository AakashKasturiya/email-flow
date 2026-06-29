import Template from "../models/Template.js";

// Helper to get full URL for images
function getFullImageUrl(req, imagePath) {
  if (!imagePath) return null;
  return `${req.protocol}://${req.get("host")}${imagePath}`;
}

export async function getAllTemplates(req, res) {
  try {
    let templates = await Template.find().sort({ updatedAt: -1 });
    // Add full image URL
    templates = templates.map(t => ({
      ...t.toObject(),
      image: getFullImageUrl(req, t.image)
    }));
    res.json(templates);
  } catch (err) {
    console.error("Failed to fetch templates:", err);
    res.status(500).json({ error: "Failed to fetch templates", details: err?.message });
  }
}

export async function getTemplateById(req, res) {
  try {
    const t = await Template.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "Template not found" });
    const templateWithUrl = {
      ...t.toObject(),
      image: getFullImageUrl(req, t.image)
    };
    res.json(templateWithUrl);
  } catch (err) {
    console.error("Failed to fetch template:", err);
    res.status(500).json({ error: "Failed to fetch template", details: err?.message });
  }
}

export async function createTemplate(req, res) {
  try {
    const body = req.body;
    if (req.file) body.image = `/images/templates/${req.file.filename}`;
    const template = new Template(body);
    await template.save();
    res.status(201).json({
      ...template.toObject(),
      image: getFullImageUrl(req, template.image)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create template", details: err.message });
  }
}

export async function updateTemplate(req, res) {
  try {
    const body = req.body;
    if (req.file) body.image = `/images/templates/${req.file.filename}`;
    const updated = await Template.findByIdAndUpdate(req.params.id, {
      ...body,
      updatedAt: Date.now()
    }, { new: true });
    if (!updated) return res.status(404).json({ error: "Template not found" });
    res.json({
      ...updated.toObject(),
      image: getFullImageUrl(req, updated.image)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update template" });
  }
}

export async function deleteTemplate(req, res) {
  try {
    const removed = await Template.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Template not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete template" });
  }
}
