const express = require("express");
const router = express.Router();
const { getGraphics } = require("../../controllers/editor/graphicController");

// Route to get graphics for the editor.

router.get("/graphics", getGraphics);

module.exports = router;