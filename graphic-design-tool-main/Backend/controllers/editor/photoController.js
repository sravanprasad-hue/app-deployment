const db = require("../../config/db");
// GET GRAPHICS.
exports.getPhotos = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT * FROM objects WHERE category = 'images'"
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching photos" });
  }
};