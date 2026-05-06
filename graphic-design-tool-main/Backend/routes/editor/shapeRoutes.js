const express = require("express");
const router = express.Router();
const { getShapes } = require("../../controllers/editor/shapeController");

// Route to get shapes for the editor.

router.get("/shapes", getShapes);

module.exports = router;