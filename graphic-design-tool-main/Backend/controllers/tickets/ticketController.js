const db = require("../../config/db");


// CREATE TICKET

exports.createTicket = async (req, res) => {

  try {

    const {
      title,
      description,
      priority_id,
      assigned_to
    } = req.body;

    const created_by = 1;

    const status_id = 1;

    const [result] = await db.execute(

      `
      INSERT INTO tickets
      (
        title,
        description,
        priority_id,
        status_id,
        created_by,
        assigned_to
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,

      [
        title,
        description,
        priority_id,
        status_id,
        created_by,
        assigned_to
      ]

    );

    res.status(201).json({

      success: true,

      message: "Ticket created successfully",

      ticketId: result.insertId

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};



// GET ALL TICKETS

exports.getTickets = async (req, res) => {

  try {

    const [tickets] = await db.execute(

      `
      SELECT

        tickets.id,
        tickets.title,
        tickets.description,

        priorities.priority_name,

        status.status_name,

        creator.name AS created_by_name,

        assignee.name AS assigned_to_name,

        tickets.created_at,
        tickets.updated_at

      FROM tickets

      LEFT JOIN priorities
      ON tickets.priority_id = priorities.id

      LEFT JOIN status
      ON tickets.status_id = status.id

      LEFT JOIN users creator
      ON tickets.created_by = creator.id

      LEFT JOIN users assignee
      ON tickets.assigned_to = assignee.id

      ORDER BY tickets.created_at DESC
      `
    );

    res.status(200).json({

      success: true,

      tickets

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};
// UPDATE TICKET STATUS

exports.updateTicketStatus = async (req, res) => {

  try {

    const ticketId = req.params.id;

    const { status_id } = req.body;

    const updated_by = 1;

    
    // CHECK EXISTING TICKET

    const [existingTicket] = await db.execute(

      `
      SELECT *
      FROM tickets
      WHERE id = ?
      `,

      [ticketId]

    );

    if (existingTicket.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Ticket not found"

      });

    }


    const old_status = existingTicket[0].status_id;


    // UPDATE STATUS

    await db.execute(

      `
      UPDATE tickets
      SET status_id = ?
      WHERE id = ?
      `,

      [
        status_id,
        ticketId
      ]

    );


    // INSERT HISTORY

    await db.execute(

      `
      INSERT INTO ticket_history
      (
        ticket_id,
        updated_by,
        old_status,
        new_status
      )
      VALUES (?, ?, ?, ?)
      `,

      [
        ticketId,
        updated_by,
        old_status,
        status_id
      ]

    );


    res.status(200).json({

      success: true,

      message: "Ticket status updated"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};
// ADD COMMENT

exports.addComment = async (req, res) => {

  try {

    const ticketId = req.params.id;

    const { comment } = req.body;

    const user_id = 1;

    
    const [result] = await db.execute(

      `
      INSERT INTO comments
      (
        ticket_id,
        user_id,
        comment
      )
      VALUES (?, ?, ?)
      `,

      [
        ticketId,
        user_id,
        comment
      ]

    );


    res.status(201).json({

      success: true,

      message: "Comment added successfully",

      commentId: result.insertId

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};




// GET COMMENTS

exports.getComments = async (req, res) => {

  try {

    const ticketId = req.params.id;

    const [comments] = await db.execute(

      `
      SELECT

        comments.id,

        comments.comment,

        comments.created_at,

        users.name AS user_name

      FROM comments

      LEFT JOIN users
      ON comments.user_id = users.id

      WHERE comments.ticket_id = ?

      ORDER BY comments.created_at ASC
      `,

      [ticketId]

    );


    res.status(200).json({

      success: true,

      comments

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};
