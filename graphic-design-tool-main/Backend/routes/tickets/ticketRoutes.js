const express = require("express");

const router = express.Router();

const ticketController = require("../../controllers/tickets/ticketController");

const {
  verifyToken,
  authorizeRoles
} = require("../../middleware/authMiddleware");



// CREATE TICKET

router.post(
  "/",
  verifyToken,
  authorizeRoles(
    "Business",
    "Developer",
    "Admin"
  ),
  ticketController.createTicket
);


// GET TICKETS

router.get(
  "/",
  verifyToken,
  ticketController.getTickets
);


// UPDATE STATUS

router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles(
    "Developer",
    "Admin"
  ),
  ticketController.updateTicketStatus
);


// ADD COMMENT

router.post(
  "/:id/comment",
  verifyToken,
  ticketController.addComment
);


// GET COMMENTS

router.get(
  "/:id/comments",
  verifyToken,
  ticketController.getComments
);


module.exports = router;
