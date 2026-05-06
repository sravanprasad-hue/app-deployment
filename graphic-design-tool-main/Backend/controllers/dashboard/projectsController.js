// console.log("PROJECT CONTROLLER LOADED");
const db = require("../../config/db");
 
// ===============================
// CREATE PROJECT
// ===============================
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
 
    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }
 
    const [result] = await db.execute(
      "INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description || null]
    );
 
    res.status(201).json({
      message: "Project created",
      projectId: result.insertId,
    });
 
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
 
// ===============================
// GET USER PROJECTS
// ===============================
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
 
    const [projects] = await db.execute(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
 
    res.json(projects);
 
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
 
// ===============================
// DELETE PROJECT
// ===============================
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
 
    // console.log("STEP 1: DELETE CALLED", { projectId, userId });
 
    // 1. Get project
    const [rows] = await db.execute(
      "SELECT * FROM projects WHERE id = ?",
      [projectId]
    );
 
    // console.log("STEP 2: PROJECT FETCH RESULT:", rows);
 
    if (rows.length === 0) {
      console.log("❌ PROJECT NOT FOUND");
      return res.status(404).json({ message: "Project not found" });
    }
 
    const project = rows[0];
 
    // console.log("STEP 3: BEFORE INSERT");
 
    // 🔥 FORCE TEST INSERT (simple static insert)
    await db.execute(
      "INSERT INTO trash (originalId, title, type, userId) VALUES (?, ?, ?, ?)",
      [project.id, project.title, "project", userId]
    );
 
    // console.log("STEP 4: INSERT SUCCESS");
 
    // 4. Delete project
    await db.execute(
      "DELETE FROM projects WHERE id = ?",
      [projectId]
    );
 
    // console.log("STEP 5: DELETE SUCCESS");
 
    res.json({ message: "Moved to Trash" });
 
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 