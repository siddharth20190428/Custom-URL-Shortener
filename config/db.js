const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Function to check if a table exists
const checkTableExists = async (tableName) => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables 
      WHERE table_name = $1
    );
  `;
  const res = await pool.query(query, [tableName]);
  return res.rows[0].exists;
};

// Create users table
const createUsersTable = async () => {
  const tableName = "users";
  const exists = await checkTableExists(tableName);

  if (exists) {
    console.log(`Table "${tableName}" already exists.`);
    return;
  }

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
    console.log(`Table "${tableName}" created successfully.`);
  } catch (err) {
    console.error(`Error creating table "${tableName}":`, err);
  }
};

// Create URLs table for short URL analytics
const createUrlsTable = async () => {
  const tableName = "urls";
  const exists = await checkTableExists(tableName);

  if (exists) {
    console.log(`Table "${tableName}" already exists.`);
    return;
  }

  const query = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      alias VARCHAR(255) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total_clicks INT DEFAULT 0,
      unique_clicks INT DEFAULT 0,
      topic VARCHAR(255)
    );
  `;

  try {
    await pool.query(query);
    console.log(`Table "${tableName}" created successfully.`);
  } catch (err) {
    console.error(`Error creating table "${tableName}":`, err);
  }
};

// Initialize tables
const initTables = async () => {
  await createUsersTable();
  await createUrlsTable();
};

initTables();

module.exports = pool;
