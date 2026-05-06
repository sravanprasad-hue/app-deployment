const db = require("../config/db"); // mysql2/promise
const jwt = require("jsonwebtoken");
 
 // ===============================
// EMAIL VALIDATION FUNCTION
// ===============================
const isValidEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};
 
// ===============================
// CHECK USER (for login/signup)
// ===============================
exports.checkUser = async (req, res) => {
  try {
    const { email, phone } = req.body;
    //added
    if (email && !isValidEmail(email)) {
  return res.status(400).json({ msg: "Invalid email format" });
}//added
 
    const identifier = email || phone;
 
    if (!identifier) return res.status(400).json({ msg: "Email or phone required" });
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    if (!users[0]) {
      // New user → return flag
      return res.json({ isNewUser: true });
    }
 
    res.json({ isNewUser: false });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
 
// ===============================
// CREATE USER (Signup)
// ===============================
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone ,role} = req.body;
    //added
    if (email && !isValidEmail(email)) {
  return res.status(400).json({ msg: "Invalid email format" });
}//added
 
 
    if (!name || (!email && !phone)) {
      return res.status(400).json({ msg: "Name and email/phone required" });
    }
      const identifier = email?.trim() || phone?.trim();
 
    const [existingUser] = await db.execute(
  "SELECT id FROM users WHERE email = ? OR phone = ?",
  [email || null, phone || null]
);
 
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
   
    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (name, email, phone,role) VALUES (?, ?, ?,?)",
      [name, email || null, phone || null,role || "user"]
    );
 
    const userId = result.insertId;
 
    // Generate OTP immediately
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 15 * 60 * 1000); // 5 min
 
    await db.execute(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [otp, otp_expiry, userId]
    );
 
    console.log(`🔐 OTP for new user (${email || phone}): ${otp}`);
 
    res.status(201).json({ msg: "User created and OTP sent", userId });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
 
// ===============================
// SEND OTP (Existing user)
// ===============================
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    //added
    if (email && !isValidEmail(email)) {
  return res.status(400).json({ msg: "Invalid email format" });
}//added
 
    const identifier = email || phone;
 
    if (!identifier) return res.status(400).json({ msg: "Email or phone required" });
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const user = users[0];
 
    if (!user) {
      return res.json({ isNewUser: true });
    }
 
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
 
    await db.execute(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [otp, otp_expiry, user.id]
    );
 
    console.log(`🔐 OTP for existing user (${identifier}): ${otp}`);
 
    res.json({ msg: "OTP sent successfully" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
 
// ===============================
// RESEND OTP
// ===============================
exports.resendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    //added
    if (email && !isValidEmail(email)) {
  return res.status(400).json({ msg: "Invalid email format" });
}//added
 
    const identifier = email || phone;
 
    if (!identifier) {
      return res.status(400).json({ msg: "Email or phone required" });
    }
 
    // 1. Check if user exists
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const user = users[0];
 
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
 
    // 2. Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 15 * 60 * 1000);
 
    // 3. Update OTP in DB
    await db.execute(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [otp, otp_expiry, user.id]
    );
 
    console.log(`🔄 Resent OTP for (${identifier}): ${otp}`);
 
    res.json({ msg: "OTP resent successfully" });
 
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
 
// ===============================
// VERIFY OTP
// ===============================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const identifier = email || phone;
 
    if (!identifier || !otp) {
      return res.status(400).json({ msg: "Email/Phone and OTP required" });
    }
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const user = users[0];
 
    if (!user) return res.status(400).json({ msg: "User not found" });
 
    if (!user.otp || user.otp !== otp.toString()) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
 
    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }
 
  const loginType = email ? "email" : "phone";

// update only if null
await db.execute(
  `UPDATE users 
   SET otp = NULL, 
       otp_expiry = NULL,
       primary_login = IF(primary_login IS NULL, ?, primary_login)
   WHERE id = ?`,
  [loginType, user.id]
);

//  fetch updated value
const [updatedRows] = await db.execute(
  "SELECT primary_login FROM users WHERE id = ?",
  [user.id]
);

const updatedUser = updatedRows[0];

const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET || "secretkey",
  { expiresIn: "1d" }
);

res.json({
  _id: user.id,
  email: user.email,
  phone: user.phone,
  primary_login: updatedUser.primary_login, 
  token,
  msg: "OTP verified successfully",
});
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
 