// config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "myuser",
  host: "postgres",
  database: "mydatabase",
  password: "mypassword",
  port: 5432,
});

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE NOT NULL,
      display_name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      profile_picture VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table created successfully.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

createUsersTable();

module.exports = pool;
