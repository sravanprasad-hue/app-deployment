const express = require("express");
const router = express.Router();
const { getPhotos } = require("../../controllers/editor/photoController");

// Route to get photos for the editor.

router.get("/photos", getPhotos);

module.exports = router;