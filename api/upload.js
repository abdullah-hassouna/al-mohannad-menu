const { put } = require('@vercel/blob');
const multiparty = require('multiparty');
const fs = require('fs');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Upload parsing error:', err);
      return res.status(500).json({ error: 'Failed to parse form' });
    }

    const file = files.image && files.image[0];
    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Try to get filename from fields, fallback to original filename
    let filename = fields.filename ? fields.filename[0] : file.originalFilename;
    
    // The filename might include "public/imgs/" prefix from our earlier frontend code.
    // Strip "public/" if it exists so it goes directly to "imgs/"
    if (filename.startsWith('public/')) {
      filename = filename.substring(7); // remove "public/"
    }

    // Ensure it goes inside the imgs directory if it doesn't already
    if (!filename.startsWith('imgs/')) {
      filename = `imgs/${filename}`;
    }

    try {
      const fileData = fs.readFileSync(file.path);
      
      const blob = await put(filename, fileData, {
        access: 'public',
        addRandomSuffix: false // We will use exact names to match data.json
      });

      res.status(200).json({ url: blob.url, path: filename });
    } catch (uploadErr) {
      console.error('Blob upload error:', uploadErr);
      res.status(500).json({ error: 'Failed to upload to blob storage' });
    }
  });
}

module.exports = handler;

// Disable Vercel's default body parser so multiparty can parse the form
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
