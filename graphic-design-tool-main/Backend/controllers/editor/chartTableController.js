const db = require("../../config/db");

// SAVE CHART.
exports.saveChart = async (req, res) => {
  try {
    const {
      design_id,
      chart_type,
      chart_data,
      chart_labels,
      x,
      y,
      width,
      height
    } = req.body;

    await db.query(
      `INSERT INTO editor 
      (design_id, chart_type, chart_data, chart_labels, x, y, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [design_id, chart_type, chart_data, chart_labels, x, y, width, height]
    );

    res.json({ message: "Chart saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving chart" });
  }
};

// SAVE TABLE
exports.saveTable = async (req, res) => {
  try {
    const {
      design_id,
      table_data,
      x,
      y,
      width,
      height
    } = req.body;

    await db.query(
      `INSERT INTO editor 
      (design_id, table_data, x, y, width, height)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [design_id, table_data, x, y, width, height]
    );

    res.json({ message: "Table saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving table" });
  }
};

// GET ALL ELEMENTS OF DESIGN
exports.getEditorData = async (req, res) => {
  try {
    const { design_id } = req.params;

    const [data] = await db.query(
      "SELECT * FROM editor WHERE design_id = ?",
      [design_id]
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};