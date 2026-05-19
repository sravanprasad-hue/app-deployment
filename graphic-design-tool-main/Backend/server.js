const ticketRoutes = require("./routes/tickets/ticketRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

 
 

const authRoutes = require("./routes/authRoutes");
//dashboard routes
const notificationRoutes = require("./routes/dashboard/notificationRoutes");
const designRoutes = require("./routes/dashboard/designRoutes");
const trashRoutes = require("./routes/dashboard/trashRoutes");
 
const errorHandler = require("./middleware/errorHandler");

const projectsRoutes = require("./routes/dashboard/projectsRoutes");
const templateRoutes = require("./routes/dashboard/templateRoutes");
// const starredRoutes = require("./routes/dashboard/starredRoutes");

// const { verifyToken } = require("./middleware/authMiddleware");
const searchRoutes = require("./routes/dashboard/searchRoutes");
const profileRoutes = require("./routes/dashboard/profileRoutes");
// Account Center routes
const appSettingRoutes = require("./routes/AccountCenter/appSettingRoutes");  
const aboutRoutes = require("./routes/AccountCenter/aboutRoutes");
const profileSettingRoutes = require("./routes/AccountCenter/profileSettingRoutes");
const teamRoutes = require("./routes/AccountCenter/teamRoutes");



 


const app = express();

/* Middleware. */
app.use(cors());
app.use(express.json());
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {

  res.send("Bug Tracker Backend Running Successfully");

});
 

/* Routes */
app.use("/api/auth", authRoutes);
//dashboard routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/trash", trashRoutes);


app.use("/api/projects", projectsRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);
// app.use("/api/starred", starredRoutes);
// Account Center routes
app.use("/api/appsetting", appSettingRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api", profileSettingRoutes);
app.use("/api/team", teamRoutes);



app.use(errorHandler);

/* Start server */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
