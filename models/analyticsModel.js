// models/analyticsModel.js
const pool = require("../config/db");

class AnalyticsModel {
  // Fetch analytics by URL IDs
  static async getAnalyticsByUrlIds(urlIds, interval = "7 days") {
    const result = await pool.query(
      "SELECT url_id, user_agent, ip_address, created_at FROM analytics WHERE url_id = ANY($1) AND created_at >= NOW() - $2::INTERVAL",
      [urlIds, interval]
    );
    return result.rows;
  }

  static async addLog(urlId, userAgent, ipAddress, geolocation) {
    const newUser = await pool.query(
      "INSERT INTO analytics (url_id, user_agent, ip_address, geolocation) VALUES ($1, $2, $3, $4)",
      [
        urlId,
        userAgent,
        ipAddress,
        geolocation ? JSON.stringify(geolocation) : null,
      ] // Store geolocation as JSON
    );
    return newUser.rows[0];
  }
}

module.exports = AnalyticsModel;
