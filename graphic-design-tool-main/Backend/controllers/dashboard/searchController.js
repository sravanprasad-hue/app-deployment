const db = require("../../config/db");
 
exports.searchProjects = async (req, res) => {
  try {
    let { q, category, type, page } = req.query;
 
    page = parseInt(page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
 
    let conditions = [];
    let values = [];
 
    // FULLTEXT search
    if (q && q.trim() !== "") {
  conditions.push("(title LIKE ? OR description LIKE ?)");
  values.push(`%${q}%`, `%${q}%`);
}
 
    if (category) {
      conditions.push("category = ?");
      values.push(category);
    }
 
    if (type) {
      conditions.push("type = ?");
      values.push(type);
    }
 
    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
 
    const sql = `
      SELECT id, title, description, created_at
      FROM projects
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
 
    const [rows] = await db.query(sql, [...values, limit, offset]);
 
    const countSql = `
      SELECT COUNT(*) as total
      FROM projects
      ${whereClause}
    `;
 
    const [countResult] = await db.query(countSql, values);
    const total = countResult[0].total;
 
    res.json({
      success: true,
      message: total > 0 ? "Data found" : "No data found",
      page,
      totalResults: total,
      totalPages: Math.ceil(total / limit),
      results: rows
    });
 
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 
 
 