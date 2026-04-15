import pool from "../db/index.js";

export const processPayment = async (req, res) => {
  try {
    const { seatId, amount } = req.body;
    const userId = req.user.id;

    if (!seatId || !amount) {
      return res.status(400).json({ error: "seatId and amount are required" });
    }

    const seatResult = await pool.query("SELECT * FROM seats WHERE id = $1 AND reserved_by_user_id = $2", [seatId, userId]);
    if (seatResult.rowCount === 0) {
      return res.status(400).json({ error: "Seat not found or not locked by you. You must select it first." });
    }

    const result = await pool.query(
      "INSERT INTO payments (user_id, seat_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, seatId, amount, 'success']
    );

    res.json({
      message: "Payment successful",
      transaction: result.rows[0],
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error during payment" });
  }
};
