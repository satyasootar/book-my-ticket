export const UsersModel = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const MoviesModel = `
  CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
  );
`;

export const SeatsModel = `
  CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(id),
    name VARCHAR(255),
    isbooked INT DEFAULT 0,
    user_id INT REFERENCES users(id),
    reserved_until TIMESTAMP,
    reserved_by_user_id INT REFERENCES users(id)
  );
`;

export const PaymentsModel = `
  CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    seat_id INT REFERENCES seats(id),
    amount INT NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
