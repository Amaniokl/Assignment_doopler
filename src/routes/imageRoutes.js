import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Image from "../models/image.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG formats allowed!"), false);
    }
  },
});

// POST /upload - Upload Image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Compress image using Sharp
    const compressedPath = `uploads/compressed-${req.file.filename}`;
    console.log(compressedPath);
    
    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    console.log(compressedPath);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(compressedPath, { folder: "uploads" });
    // console.log(sdfsdfsdf);
    
    console.log(result);
    
    // Save metadata in MongoDB
    const newImage = new Image({ filename: req.file.filename, url: result.secure_url });
    await newImage.save();

    // Cleanup local files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(compressedPath);

    res.status(201).json({ message: "Image uploaded successfully", url: result.secure_url, id:newImage._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /images/:id - Fetch Image by ID
router.get("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    res.json({ url: image.url });
  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});

// DELETE /images/:id - Delete Image
router.delete("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Delete from Cloudinary
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`uploads/${publicId}`);

    // Remove from MongoDB
    await image.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting image" });
  }
});

export default router;
