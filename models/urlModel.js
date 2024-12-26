const pool = require("../config/db"); // Adjust the path as necessary

class UrlModel {
  static async getUrl(alias) {
    const result = await pool.query("SELECT * FROM urls WHERE alias = $1", [
      alias,
    ]);
    return result;
  }

  // Method to check if an alias already exists
  static async aliasExists(alias) {
    const result = await pool.query("SELECT * FROM urls WHERE alias = $1", [
      alias,
    ]);
    return result.rows.length > 0;
  }

  // Method to add a new URL
  static async addUrl(originalUrl, customAlias, topic, user_id) {
    let alias = customAlias ? customAlias : new Date().now(); // Generate a unique alias if not provided

    // Check if the alias already exists
    if (await this.aliasExists(alias)) {
      throw new Error(
        "Custom alias already exists. Please choose another one."
      );
    }

    const createdAt = new Date();
    await pool.query(
      "INSERT INTO urls (alias, original_url, created_at, topic, user_id) VALUES ($1, $2, $3, $4, $5)",
      [alias, originalUrl, createdAt, topic, user_id]
    );

    return alias; // Return the generated or provided alias
  }
}

module.exports = UrlModel;
