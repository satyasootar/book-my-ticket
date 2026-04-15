import pool from "../db/index.js";

export const getMovies = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (error) {
    console.error("Get Movies Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSeatsForMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const result = await pool.query(`
      SELECT 
        id, movie_id, name, isbooked, user_id, reserved_until, reserved_by_user_id,
        CASE
          WHEN isbooked = 1 THEN true
          WHEN isbooked = 2 AND reserved_until > NOW() THEN true
          ELSE false
        END as "is_unavailable",
        CASE
          WHEN isbooked = 2 AND reserved_until > NOW() THEN true
          ELSE false
        END as "is_locked"
      FROM seats 
      WHERE movie_id = $1
      ORDER BY id ASC
    `, [movieId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No seats or movie found" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Get Seats Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
