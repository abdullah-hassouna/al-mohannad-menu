// @ts-nocheck
const { put, del, list } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const dataString = JSON.stringify(req.body, null, 2);

    // Step 1: Delete ALL existing data.json blobs
    const { blobs } = await list({ prefix: "data.json" });
    console.log(`Found ${blobs.length} existing blob(s)`);

    if (blobs.length > 0) {
      for (const blob of blobs) {
        console.log("Deleting:", blob.url);
        await del(blob.url); // delete one by one, not as array
      }
      console.log("✓ All old blobs deleted");
    }

    // Step 2: Upload new data.json
    const blob = await put("data.json", dataString, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });

    console.log("✓ data.json saved:", blob.url);
    res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error("❌ Full error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
