// @ts-nocheck
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { put, del, list } = require("@vercel/blob");
require("dotenv").config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3000;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

console.log(
  "🔑 Blob token loaded:",
  BLOB_TOKEN ? "✅ YES" : "❌ MISSING - check .env",
);

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Support larger base64 fallbacks if any
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure public/imgs directory exists
const UPLOADS_DIR = path.join(__dirname, "public", "imgs");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve static assets from project root and specific directories
app.use(express.static(__dirname));

// Configure multer for file uploading
const crypto = require("crypto");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Generate a safe, unique filename: timestamp + random hex + original extension
    const ext = path.extname(file.originalname) || "";
    const name = Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Endpoint: Upload image
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let finalFilename = req.file.filename;
    if (req.body.filename) {
      const ext = path.extname(req.file.filename) || "";
      const baseName = req.body.filename
        .replace(/^.*[\\/]/, "")
        .replace(/\.[^/.]+$/, "");
      finalFilename = baseName + ext;
    }

    // Strip public if present
    if (finalFilename.startsWith("public/")) {
      finalFilename = finalFilename.substring(7);
    }
    if (!finalFilename.startsWith("imgs/")) {
      finalFilename = `imgs/${finalFilename}`;
    }

    const fileData = fs.readFileSync(req.file.path);
    const blob = await put(finalFilename, fileData, {
      access: "public",
      addRandomSuffix: false,
      token: BLOB_TOKEN,
    });

    console.log("✓ Image uploaded to Blob:", blob.url);
    res.json({ path: finalFilename, url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Endpoint: Save state to data.json
app.post("/api/save", async (req, res) => {
  try {
    console.log("📥 Received /api/save request");
    const dataString = JSON.stringify(req.body, null, 2);
    const blob = await put("data.json", dataString, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token: BLOB_TOKEN,
    });

    console.log("✅ data.json saved to Vercel Blob:", blob.url);
    res.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("❌ Save state error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint: Load state from data.json
app.get("/api/load", (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data.json");
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf8");
      return res.json(JSON.parse(data));
    }
    res.status(404).json({ error: "data.json not found" });
  } catch (err) {
    console.error("Load state error:", err);
    res.status(500).json({ error: "Failed to load state" });
  }
});

// Serve index.html by default
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Shawarma Almohannad backend server is running!`);
  console.log(`==================================================\n`);
});
