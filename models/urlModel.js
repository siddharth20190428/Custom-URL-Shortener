const pool = require("../config/db"); // Adjust the path as necessary

class UrlModel {
  static BASE62 =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  static idCounter = 1;

  static encode(num) {
    let base62 = "";
    while (num > 0) {
      const remainder = num % 62;
      base62 = BASE62[remainder] + base62;
      num = Math.floor(num / 62);
    }
    return base62 || BASE62[0]; // Return '0' if num is 0
  }

  // Fetch URL by alias
  static async getUrlByAlias(alias) {
    const result = await pool.query("SELECT * FROM urls WHERE alias = $1", [
      alias,
    ]);
    return result;
  }
  // Fetch URLs by topic
  static async getUrlsByTopic(topic, userId) {
    const result = await pool.query(
      "SELECT id, alias FROM urls WHERE topic = $1 AND user_id = $2",
      [topic, userId]
    );
    return result.rows;
  }

  // Fetch URLs by user ID
  static async getUrlsByUserId(userId) {
    const result = await pool.query(
      "SELECT id, alias FROM urls WHERE user_id = $1",
      [userId]
    );
    return result.rows;
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
    // Check if the alias already exists
    if (customAlias) {
      if (await this.aliasExists(customAlias)) {
        throw new Error(
          "Custom alias already exists. Please choose another one."
        );
      } else if (customAlias.length > 8)
        throw new Error("Custom alias must be less than or equal to 8 chars.");
    }

    let alias = customAlias ? customAlias : this.encode(this.idCounter); // Generate a unique alias if not provided

    while (alias.length < 8) {
      alias = "0" + alias; // Pad with '0'
    }

    this.idCounter++;

    const createdAt = new Date();
    await pool.query(
      "INSERT INTO urls (alias, original_url, created_at, topic, user_id) VALUES ($1, $2, $3, $4, $5)",
      [alias, originalUrl, createdAt, topic, user_id]
    );

    return alias; // Return the generated or provided alias
  }
}

module.exports = UrlModel;
