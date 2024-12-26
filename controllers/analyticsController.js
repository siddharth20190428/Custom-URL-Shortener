const UrlModel = require("../models/urlModel");
const AnalyticsModel = require("../models/analyticsModel");
const { formatClicksByDate, formatAnalyticsData } = require("../utils");

const handleSingleAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    const url = await UrlModel.getUrlByAlias(alias);
    if (!url.rowCount) return res.status(404).json({ error: "URL not found" });
    if (url.rows[0].user_id !== req.user.userId)
      return res.status(401).json({
        error:
          "You are not allowed to see analytics for URLs you didn't created.",
      });

    const analytics = await AnalyticsModel.getAnalyticsByUrlIds([
      url.rows[0].id,
    ]);

    const response = {
      totalClicks: analytics.length,
      clicksByDate: formatClicksByDate(analytics),
      ...formatAnalyticsData(analytics),
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAnalyticsByTopic = async (req, res) => {
  const { topic } = req.params;

  try {
    const urls = await UrlModel.getUrlsByTopic(topic);
    if (!urls.length)
      return res.status(404).json({ error: "No URLs found for this topic" });

    const urlIds = urls.map((url) => url.id);
    const analytics = await AnalyticsModel.getAnalyticsByUrlIds(urlIds);

    const response = {
      totalClicks: analytics.length,
      clicksByDate: formatClicksByDate(analytics),
      ...formatAnalyticsData(analytics),
      urls: urls.map((url) => ({
        shortUrl: url.alias,
        totalClicks: analytics.filter((a) => a.url_id === url.id).length,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving topic analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOverallAnalytics = async (req, res) => {
  const userId = req.user.userId;

  try {
    const urls = await UrlModel.getUrlsByUserId(userId);
    if (!urls.length) {
      return res.json({
        totalUrls: 0,
        totalClicks: 0,
        uniqueClicks: 0,
        clicksByDate: [],
        osType: [],
        deviceType: [],
      });
    }

    const urlIds = urls.map((url) => url.id);
    const analytics = await AnalyticsModel.getAnalyticsByUrlIds(urlIds);

    const response = {
      totalUrls: urls.length,
      totalClicks: analytics.length,
      clicksByDate: formatClicksByDate(analytics),
      ...formatAnalyticsData(analytics),
    };

    res.json(response);
  } catch (error) {
    console.error("Error retrieving overall analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleSingleAnalytics,
  getAnalyticsByTopic,
  getOverallAnalytics,
};
