const express = require("express");
const router = express.Router();

 
const {
  createTemplate,
  getTemplates,
  searchTemplates,
  filterTemplates,
} = require("../../controllers/dashboard/templateController");
 
router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/search", searchTemplates);
router.get("/filter", filterTemplates);

 
 

 
module.exports = router;
 