import express from "express";
import multer from "multer";
import fs from "fs/promises";
import { error } from "console";
import cloudinary from "./cloudinary.js";
import db from "./db.js";

const app = express();
const PORT = 3000;
const myFolder = "uploads";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    createAutoFolderForImageUpload();
    cb(null, myFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/profile", upload.single("avatar"), async (req, res) => {
  try {
    if (!req?.file) {
      return response(res, 400, "File not uploaded", null);
    }

    const uploadImage = await cloudinary.uploader.upload(req.file.path);

    if (uploadImage?.secure_url) {
      const currentFolder = await fs.readdir(myFolder);

      await fs.unlink(req?.file.path);
      if (currentFolder.length > 0) {
        await fs.rmdir(myFolder);
      }
      response(res, 200, "File uploaded successfully", uploadImage);
    } else {
      response(res, 500, "Error uploading file", null);
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Server error", null);
  }
});

const createAutoFolderForImageUpload = async () => {
  try {
    await fs.mkdir(myFolder, { recursive: true });
    console.log(`📁 '${myFolder}' folder is ready`);
  } catch (err) {
    console.error("❌ Error creating folder:", err);
  }
};

const response = (res, state, message, data) => {
  return res.status(state).json({
    message,
    data,
  });
};
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
