import pool from "./index.js";
import { UsersModel, MoviesModel, SeatsModel, PaymentsModel } from "../models/models.js";

async function setup() {
  try {
    const client = await pool.connect();
    
    console.log("Starting Production-Safe Database Initialization...");

    await client.query(UsersModel);
    await client.query(MoviesModel);
    await client.query(SeatsModel);
    await client.query(PaymentsModel);

    console.log("✓ Core Tables verified safely.");

    await client.query(`
      INSERT INTO movies (title, description) VALUES
      ('Dhurandhar The Revenge', 'A high-octane action thriller of epic proportions.'),
      ('Bhooth Bangla', 'A spooky comedy mixing horror and thrills.'),
      ('Dacoit', 'An intense romantic drama interwoven with action.'),
      ('Project Hail Mary', 'Adventure through space to save humanity.'),
      ('Murabi', 'A fun-filled emotional family drama.')
      ON CONFLICT (title) DO NOTHING;
    `);

    console.log("✓ Core Movies verified.");

    const moviesResult = await client.query(`SELECT id, title FROM movies;`);
    
    for (const movie of moviesResult.rows) {
      const seatCheck = await client.query(`SELECT COUNT(*) FROM seats WHERE movie_id = $1;`, [movie.id]);
      
      if (parseInt(seatCheck.rows[0].count) === 0) {
        console.log(`Generating 50 seats securely for ${movie.title}...`);
        for (let i = 1; i <= 50; i++) {
          await client.query(`
            INSERT INTO seats (movie_id, name, isbooked)
            VALUES ($1, $2, 0);
          `, [movie.id, `Seat ${i}`]);
        }
      }
    }

    console.log("✓ All Movie Capacity initialized and verified safely.");

    client.release();
    console.log("🚀 Production Database Setup completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Production Database Setup failed critically:", error);
    process.exit(1);
  }
}

setup();
