const db = require("../../config/db");
 
// ===============================
// CREATE NOTIFICATION (Internal)
// ===============================
  exports.createNotification = async (
  user_id,
  sender_id,
  type,
  reference_id,
  message,
  status = null
) => {
  try {
    const sql = `
      INSERT INTO notifications
      (user_id, sender_id, type, reference_id, message, status, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
 
    await db.execute(sql, [
      user_id,
      sender_id,
      type,
      reference_id,
      message,
      status,
      0
    ]);
 
  } catch (error) {
    console.error("Notification Error:", error);
  }
};
 
// ===============================
// GET ALL NOTIFICATIONS                 //  Get sender's name for someone to show in notification list
// ===============================
exports.getNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
 
    const sql = `
      SELECT
        n.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name
      FROM notifications n
      LEFT JOIN users sender ON n.sender_id = sender.id
      LEFT JOIN users receiver ON n.user_id = receiver.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;
 
    const [rows] = await db.execute(sql, [user_id]);
 
    return res.status(200).json({
      success: true,
      data: rows,
    });
 
  } catch (error) {
    next(error);
  }
};
 
// ===============================
// MARK SINGLE NOTIFICATION AS READ
// ===============================
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
 
    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `;
 
    const [result] = await db.execute(sql, [id, user_id]);
 
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Marked as read",
    });
 
  } catch (error) {
    next(error);
  }
};
 
 
// ===============================
// MARK ALL AS READ
// ===============================
exports.markAllAsRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;
 
    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `;
 
    await db.execute(sql, [user_id]);
 
    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
 
  } catch (error) {
    next(error);
  }
};
 
 
// ===============================
// UNREAD COUNT
// ===============================
exports.getUnreadCount = async (req, res, next) => {
  try {
    const user_id = req.user.id;
 
    const sql = `
      SELECT COUNT(*) as unreadCount
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `;
 
    const [rows] = await db.execute(sql, [user_id]);
 
    return res.status(200).json({
      success: true,
      unreadCount: rows[0].unreadCount,
    });
 
  } catch (error) {
    next(error);
  }
};
 exports.deleteNotification = async (req, res, next) => {
  try {
 
    const user_id = req.user.id;
    const { id } = req.params;
    const ids = req.body?.ids;
 
    let sql;
    let values;
 
    // MULTIPLE DELETE
    if (Array.isArray(ids) && ids.length > 0) {
 
      const placeholders = ids.map(() => "?").join(",");
 
      sql = `
        DELETE FROM notifications
        WHERE user_id = ? AND id IN (${placeholders})
      `;
 
      values = [user_id, ...ids];
 
    }
 
    // SINGLE DELETE
    else if (id) {
 
      sql = `
        DELETE FROM notifications
        WHERE id = ? AND user_id = ?
      `;
 
      values = [id, user_id];
 
    }
 
    else {
      return res.status(400).json({
        success: false,
        message: "Provide id or ids"
      });
    }
 
    const [result] = await db.execute(sql, values);
 
    return res.status(200).json({
      success: true,
      deletedRows: result.affectedRows
    });
 
  } catch (error) {
    next(error);
  }
};
 
//accepted
exports.acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
 
    // 1️ Get original notification
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE id = ?",
      [id]
    );
 
    const notification = rows[0];
 
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }
 
      // 2️ Get sender name
    const [senderRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [notification.sender_id]
    );
 
    const senderName = senderRows[0]?.name;
 
    // 3️ Get current user name
    const [receiverRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [user_id]
    );
 
    const receiverName = receiverRows[0]?.name;
 
    // UPDATE SAME ROW
   await db.execute(
  `UPDATE notifications
   SET status = 'accepted',
       type = 'access_accepted',
       message = ?,
       is_read = 1
   WHERE id = ? AND user_id = ?`,
  [
    `You accepted ${senderName}'s edit request`,
    id,
    user_id
  ]
);
 
// send new notification
await db.execute(
  `INSERT INTO notifications
   (user_id, sender_id, type, reference_id, message, status, is_read)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    notification.sender_id,
    user_id,
    "access_accepted",
    notification.reference_id,
    `${receiverName} accepted your edit access request`,
    "accepted",
    0
  ]
);
    return res.status(200).json({
      success: true,
      message: "Request accepted"
    });
 
  } catch (error) {
    next(error);
  }
};
//rejected
exports.rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
 
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE id = ?",
      [id]
    );
 
    const notification = rows[0];
   
 
// ✅ ADD THIS
if (!notification) {
  return res.status(404).json({
    success: false,
    message: "Notification not found"
  });
}
 
 // get sender name
    const [senderRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [notification.sender_id]
    );
 
    const senderName = senderRows[0]?.name;
 // get current user name
    // const [receiverRows] = await db.execute(
    //   "SELECT name FROM users WHERE id = ?",
    //   [user_id]
    // );
 
    // const receiverName = receiverRows[0]?.name;
 
 
   await db.execute(
  `UPDATE notifications
   SET status = 'rejected',
       type = 'access_rejected',
        message = ?,
       is_read = 1
   WHERE id = ? AND user_id = ?`,
  [
    `You rejected ${senderName}'s edit request`,
    id,
    user_id
  ]
);
 
//     await db.execute(
//   `INSERT INTO notifications
//    (user_id, sender_id, type, reference_id, message, status, is_read)
//    VALUES (?, ?, ?, ?, ?, ?, ?)`,
//   [
//     notification.sender_id,
//     user_id,
//     "access_rejected",
//     notification.reference_id,
//     `${receiverName} rejected your edit access request`,
//     "rejected",   // 🔥 FIX
//     0
//   ]
// );
 
    return res.status(200).json({
      success: true,
      message: "Request rejected"
    });
 
  } catch (error) {
    next(error);
  }
};
 
 exports.markBulkRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { ids } = req.body;
 
    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No IDs provided"
      });
    }
 
    const placeholders = ids.map(() => "?").join(",");
 
    const sql = `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND id IN (${placeholders})
    `;
 
    await db.execute(sql, [user_id, ...ids]);
 
    return res.status(200).json({
      success: true,
      message: "Bulk marked as read"
    });
 
  } catch (error) {
    next(error);
  }
};