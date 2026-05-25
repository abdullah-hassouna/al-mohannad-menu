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
const crypto = require('crypto');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Generate a safe, unique filename: timestamp + random hex + original extension
    const ext = path.extname(file.originalname) || '';
    const name = Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext;
    cb(null, name);
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
    
    let finalFilename = req.file.filename; // default: generated safe name
    
    // If client provided a desired filename, use it
    if (req.body.filename) {
      const ext = path.extname(req.file.filename) || '';
      // Sanitize the provided filename
      const baseName = req.body.filename
        .replace(/^.*[\\/]/, '') // remove directory path
        .replace(/\.[^/.]+$/, ''); // remove extension
      finalFilename = baseName + ext;
    }
    
    // If the filename changed, rename the file
    if (finalFilename !== req.file.filename) {
      const oldPath = path.join(UPLOADS_DIR, req.file.filename);
      const newPath = path.join(UPLOADS_DIR, finalFilename);
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed: ${req.file.filename} → ${finalFilename}`);
      } catch (err) {
        console.error('Rename failed, using generated name:', err);
        finalFilename = req.file.filename;
      }
    }
    
    const relativePath = `public/imgs/${finalFilename}`;
    const urlPath = '/' + relativePath;
    console.log(`✓ Image uploaded and saved to: ${relativePath}`);
    res.json({ path: relativePath, url: urlPath });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Endpoint: Save state to data.json
app.post('/api/save', (req, res) => {
  try {
    console.log('📥 Received /api/save request');
    console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const dataPath = path.join(__dirname, 'data.json');
    const dataString = JSON.stringify(req.body, null, 2);
    
    // Write file synchronously to ensure it completes before responding
    fs.writeFileSync(dataPath, dataString, 'utf8');
    console.log('✓ Database state saved to data.json successfully');
    
    res.json({ success: true, message: 'Data saved to data.json' });
  } catch (err) {
    console.error('❌ Save state error:', err);
    res.status(500).json({ success: false, error: err.message });
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
