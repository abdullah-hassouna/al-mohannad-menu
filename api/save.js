// @ts-nocheck
const { put, del, list } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const dataString = JSON.stringify(req.body, null, 2);

    // Delete existing data.json if it exists
    const { blobs } = await list();
    const existing = blobs.find((b) => b.pathname === "data.json");
    if (existing) {
      await del(existing.url);
      console.log("✓ Deleted old data.json");
    }

    // Upload the new one
    const blob = await put("data.json", dataString, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    console.log("✓ data.json saved:", blob.url);
    res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error("❌ Save error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
