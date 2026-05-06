const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

// function to upload one folder
const uploadFolder = async (folderPath, category) => {
  const files = fs.readdirSync(folderPath);

  for (let file of files) {
    const filePath = path.join(folderPath, file);

    try {
      // upload to cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: category
      });

      // get file type
      const ext = file.split(".").pop();

      // save in database
      await db.query(
        "INSERT INTO objects (name, category, type, asset_url) VALUES (?, ?, ?, ?)",
        [file, category, ext, result.secure_url]
      );

      console.log(file + " uploaded successfully");

    } catch (err) {
      console.log("Error uploading:", file);
    }
  }
};

// run upload.
const startUpload = async () => {
  await uploadFolder("./assets/icons", "icons");
  await uploadFolder("./assets/graphics", "graphics");
//   await uploadFolder("./assets/images", "images");

  console.log("All files uploaded");
};

startUpload();