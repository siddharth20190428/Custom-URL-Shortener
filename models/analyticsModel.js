// models/analyticsModel.js
const pool = require("../config/db");

class AnalyticsModel {
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
