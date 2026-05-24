const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support larger base64 fallbacks if any
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure public/imgs directory exists
const UPLOADS_DIR = path.join(__dirname, 'public', 'imgs');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve static assets from project root and specific directories
app.use(express.static(__dirname));

// Configure multer for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Keep the original filename (supports Arabic names) so data.json paths stay consistent
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Endpoint: Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return path relative to project root
    const relativePath = `public/imgs/${req.file.filename}`;
    console.log(`✓ Image uploaded and saved to: ${relativePath}`);
    res.json({ path: relativePath });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Endpoint: Save state to data.json
app.post('/api/save', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const dataString = JSON.stringify(req.body, null, 2);
    
    fs.writeFileSync(dataPath, dataString, 'utf8');
    console.log('✓ Database state saved to data.json');
    res.json({ success: true });
  } catch (err) {
    console.error('Save state error:', err);
    res.status(500).json({ error: 'Failed to save state to data.json' });
  }
});

// Endpoint: Load state from data.json
app.get('/api/load', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return res.json(JSON.parse(data));
    }
    res.status(404).json({ error: 'data.json not found' });
  } catch (err) {
    console.error('Load state error:', err);
    res.status(500).json({ error: 'Failed to load state' });
  }
});

// Serve index.html by default
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Shawarma Almohannad backend server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Images Folder: ${UPLOADS_DIR}`);
  console.log(`==================================================\n`);
});
