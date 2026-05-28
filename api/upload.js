// @ts-nocheck
const { put, del, list } = require("@vercel/blob");
const multiparty = require("multiparty");
const fs = require("fs");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form" });
    }

    const file = files.image && files.image[0];
    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Build clean filename
    let filename = fields.filename ? fields.filename[0] : file.originalFilename;
    filename = filename.replace(/^public\//, "");
    if (!filename.startsWith("imgs/")) {
      filename = `imgs/${filename}`;
    }

    try {
      // Delete old blob with same name if exists
      const { blobs } = await list();
      const existing = blobs.find((b) => b.pathname === filename);
      if (existing) {
        await del(existing.url);
        console.log("✓ Deleted old image:", filename);
      }

      // Upload new image
      const fileData = fs.readFileSync(file.path);
      const blob = await put(filename, fileData, {
        access: "public",
        addRandomSuffix: false,
      });

      console.log("✓ Image uploaded:", blob.url);
      res.status(200).json({ url: blob.url, path: filename });
    } catch (uploadErr) {
      console.error("❌ Upload error:", uploadErr);
      res.status(500).json({ error: uploadErr.message });
    }
  });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
