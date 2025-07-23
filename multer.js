import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import cloudinary from "./cloudinary.js";

const app = express();
const PORT = 3000;
const myFolder = "uploads";

// Ensure folder exists
async function createAutoFolderForImageUpload() {
  try {
    await fs.mkdir(myFolder, { recursive: true });
    console.log(`📁 '${myFolder}' folder is ready`);
  } catch (err) {
    console.error("❌ Error creating folder:", err);
  }
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await createAutoFolderForImageUpload();

    cb(null, myFolder);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static(myFolder));

// Routes
app.post("/profile", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ data: "❌ Upload failed. No file received." });
    }

    //? Upload to Cloudinary
    const uploadImage = await cloudinary.uploader.upload(req.file?.path);

    if (uploadImage.secure_url) {
      await fs.unlink(req.file?.path);

      //? check the upload file if empty or not if emplty then remove also folder
      const files = await fs.readdir(myFolder);
      if (files.length === 0) {
        await fs.rmdir(myFolder);
      }
    }

    res.status(200).json({
      data: "✅ Upload successful",
      url: uploadImage.secure_url,
    });
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    res.status(500).json({ data: "❌ Upload failed on server." });
  }
});

// Start the server
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
