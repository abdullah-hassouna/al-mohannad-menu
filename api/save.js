const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataString = JSON.stringify(req.body, null, 2);
    
    // Upload directly to Vercel Blob, overwriting the existing data.json
    const blob = await put('data.json', dataString, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false // We want to overwrite the exact file
    });

    res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error saving data to Blob:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
