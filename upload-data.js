// @ts-nocheck
require("dotenv").config();
const { put, del, list } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("❌ BLOB_READ_WRITE_TOKEN not found in .env");
    process.exit(1);
  }

  const dataPath = path.join(__dirname, "data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("❌ data.json not found in project root");
    process.exit(1);
  }

  const dataStr = fs.readFileSync(dataPath, "utf8");
  console.log(`📄 Read local data.json (${dataStr.length} bytes)`);

  // Step 1: delete existing blobs named data.json
  try {
    const { blobs } = await list({ prefix: "data.json", token });
    if (blobs.length > 0) {
      await del(
        blobs.map((b) => b.url),
        { token },
      );
      console.log(`🗑️  Deleted ${blobs.length} existing data.json from Blob`);
    }
  } catch (e) {
    console.warn("⚠️  Could not delete old blob (continuing):", e.message);
  }

  // Step 2: upload new data.json
  const blob = await put("data.json", dataStr, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    token,
  });

  console.log("✅ Uploaded successfully!");
  console.log("🔗 URL:", blob.url);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err.message);
  process.exit(1);
});
