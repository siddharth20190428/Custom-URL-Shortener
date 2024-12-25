// models/userModel.js
const pool = require("../config/db");

const findUserByGoogleId = async (googleId) => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [
    googleId,
  ]);
  return result.rows[0];
};

const createUser = async (googleId, displayName, email, profilePicture) => {
  const newUser = await pool.query(
    "INSERT INTO users (google_id, display_name, email, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *",
    [googleId, displayName, email, profilePicture]
  );
  return newUser.rows[0];
};

module.exports = {
  findUserByGoogleId,
  createUser,
};
