const db = require("../../config/db");
 
// CREATE TEMPLATE

exports.createTemplate = async (req, res) => {

  try {

    const { title, category, type, industry, is_premium } = req.body;
 
    const [result] = await db.query(

      "INSERT INTO templates (title, category, type, industry, is_premium) VALUES (?, ?, ?, ?, ?)",

      [title, category, type, industry, is_premium]

    );
 
    res.status(201).json({

      message: "Template created",

      id: result.insertId,

    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
 
 
// GET ALL TEMPLATES
exports.getTemplates = async (req, res) => {
 
  try {
 
    const [rows] = await db.query(`SELECT * FROM templates`);
 
    res.json({
      success: true,
      data: rows
    });
 
  } catch (error) {
 
    res.status(500).json({
      success: false,
      error: error.message
    });
 
  }
 
};
 
 
// SEARCH TEMPLATE
exports.searchTemplates = async (req, res) => {
 
  try {
 
    const search = req.query.search || "";
 
    const [rows] = await db.query(
      `SELECT * FROM templates WHERE title LIKE ?`,
      [`%${search}%`]
    );
 
    res.json({
      success: true,
      data: rows
    });
 
  } catch (error) {
 
    res.status(500).json({
      success: false,
      error: error.message
    });
 
  }
 
};
 
 
// FILTER TEMPLATE
exports.filterTemplates = async (req, res) => {
 
  try {
 
    const { category, type, industry } = req.query;
 
    let query = "SELECT * FROM templates WHERE 1=1";
    let values = [];
 
    if (category) {
      query += " AND category = ?";
      values.push(category);
    }
 
    if (type) {
      query += " AND type = ?";
      values.push(type);
    }
 
    if (industry) {
      query += " AND industry = ?";
      values.push(industry);
    }
 
    const [rows] = await db.query(query, values);
 
    res.json({
      success: true,
      data: rows
    });
 
  } catch (error) {
 
    res.status(500).json({
      success: false,
      error: error.message
    });
 
  }
 
};
 