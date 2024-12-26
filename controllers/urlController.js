const UrlModel = require("../models/urlModel");
const AnalyticsModel = require("../models/analyticsModel");
const geoip = require("geoip-lite");

const handleShortenUrl = async (req, res, next) => {
  const { longUrl, customAlias, topic } = req.body;

  // Validate the request body
  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  try {
    // Use the UrlModel to add the new URL
    const alias = await UrlModel.addUrl(
      longUrl,
      customAlias,
      topic,
      req.user.userId
    );

    // Construct the short URL
    const shortUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/shorten/${alias}`;

    // Respond with the short URL and creation timestamp
    return res.status(201).json({ shortUrl, createdAt: new Date() });
  } catch (err) {
    console.error("Error creating short URL:", err);
    return res.status(400).json({ error: err.message });
  }
};

const handleRedirectAliasUrl = async (req, res) => {
  const alias = req.params.alias;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip; // Get the user's IP address

  try {
    // Find the original URL based on the alias
    const urlResult = await UrlModel.getUrlByAlias(alias);

    if (urlResult.rows.length === 0) {
      return res.status(404).send("Short URL not found");
    }

    const originalUrl = urlResult.rows[0].original_url;
    const urlId = urlResult.rows[0].id;

    // Log the redirect in the analytics table
    const geolocation = geoip.lookup(ipAddress); // Get geolocation data
    await AnalyticsModel.addLog(urlId, userAgent, ipAddress, geolocation);

    // Redirect to the original URL
    return res.redirect(originalUrl);
  } catch (err) {
    console.error("Error during redirect:", err);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleShortenUrl, handleRedirectAliasUrl };
