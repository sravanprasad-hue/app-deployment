const db = require("../../config/db");
// shapes for editor.
exports.getShapes = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT * FROM objects WHERE category = 'icons'"
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching shapes" });
  }
};