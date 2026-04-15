import pool from "../db/index.js";

export const bookSeat = async (req, res) => {
  const conn = await pool.connect();
  try {
    const seatId = parseInt(req.params.id);
    if (isNaN(seatId)) return res.status(400).json({ error: "Invalid seat ID" });
    const userId = req.user.id;
    const userEmail = req.user.email;

    const name = req.body.name || userEmail;

    await conn.query("BEGIN");

    const sql = `
      SELECT * FROM seats 
      WHERE id = $1 AND (isbooked = 0 OR (isbooked = 2 AND (reserved_until <= NOW() OR reserved_by_user_id = $2)))
      FOR UPDATE
    `;
    const result = await conn.query(sql, [seatId, userId]);

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      return res.status(400).json({ error: "Seat is already booked or temporarily locked by someone else" });
    }

    const sqlU = "UPDATE seats SET isbooked = 1, name = $2, user_id = $3 WHERE id = $1 RETURNING *";
    const updateResult = await conn.query(sqlU, [seatId, name, userId]);

    await conn.query("COMMIT");
    res.json({ message: "Seat successfully booked", seat: updateResult.rows[0] });

  } catch (ex) {
    await conn.query("ROLLBACK");
    console.error("Booking Error:", ex);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    conn.release();
  }
};

export const lockSeat = async (req, res) => {
  const conn = await pool.connect();
  try {
    const seatId = parseInt(req.params.id);
    if (isNaN(seatId)) return res.status(400).json({ error: "Invalid seat ID" });
    const userId = req.user.id;
    
    await conn.query("BEGIN");
    
    const sql = `
      SELECT * FROM seats 
      WHERE id = $1 AND (isbooked = 0 OR (isbooked = 2 AND reserved_until <= NOW()))
      FOR UPDATE
    `;
    const result = await conn.query(sql, [seatId]);
    
    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      const existing = await conn.query("SELECT * FROM seats WHERE id = $1", [seatId]);
      if (existing.rowCount > 0 && existing.rows[0].isbooked === 2 && existing.rows[0].reserved_by_user_id === userId) {
         return res.json({ message: "Already locked by you (Skipping relock refresh)", seat: existing.rows[0] });
      }
      return res.status(400).json({ error: "Seat is unavailable (booked or currently locked)" });
    }
    
    const sqlU = `
      UPDATE seats 
      SET isbooked = 2, reserved_until = NOW() + INTERVAL '2 minutes', reserved_by_user_id = $2 
      WHERE id = $1 RETURNING *
    `;
    const updateResult = await conn.query(sqlU, [seatId, userId]);
    
    await conn.query("COMMIT");
    res.json({ message: "Seat temporally locked for 2 minutes", seat: updateResult.rows[0] });
  } catch(ex){
    await conn.query("ROLLBACK");
    console.error("Lock Error:", ex);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    conn.release();
  }
};

export const unlockSeat = async (req, res) => {
  const conn = await pool.connect();
  try {
    const seatId = parseInt(req.params.id);
    if (isNaN(seatId)) return res.status(400).json({ error: "Invalid seat ID" });
    const userId = req.user.id;

    await conn.query("BEGIN");

    const sql = "SELECT * FROM seats WHERE id = $1 FOR UPDATE";
    const result = await conn.query(sql, [seatId]);

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "Seat not found" });
    }

    const seat = result.rows[0];
    if (seat.isbooked !== 2 || seat.reserved_by_user_id !== userId) {
      await conn.query("ROLLBACK");
      return res.status(403).json({ error: "You can only unlock seats you have temporarily locked" });
    }

    const sqlU = "UPDATE seats SET isbooked = 0, reserved_until = NULL, reserved_by_user_id = NULL WHERE id = $1";
    await conn.query(sqlU, [seatId]);

    await conn.query("COMMIT");
    res.json({ message: "Seat successfully unlocked" });
  } catch (ex) {
    await conn.query("ROLLBACK");
    console.error("Unlock Error:", ex);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    conn.release();
  }
};
