const UrlModel = require("../models/urlModel");
const AnalyticsModel = require("../models/analyticsModel");
const geoip = require("geoip-lite");
const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

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
    // Check Redis cache for the alias
    const cachedUrl = await getAsync(alias);

    if (cachedUrl) {
      // Parse the cached value
      const cachedData = JSON.parse(cachedUrl);

      // Log the redirect in the analytics table
      const geolocation = geoip.lookup(ipAddress);
      await AnalyticsModel.addLog(
        cachedData.id,
        userAgent,
        ipAddress,
        geolocation
      );

      // Redirect to the cached original URL
      return res.redirect(cachedData.original_url);
    }

    // Fetch from the database if not in Redis
    const urlResult = await UrlModel.getUrlByAlias(alias);
    if (urlResult.rows.length === 0) {
      return res.status(404).send("Short URL not found");
    }

    const originalUrl = urlResult.rows[0].original_url;
    const urlId = urlResult.rows[0].id;

    // Cache the result in Redis
    const cacheValue = JSON.stringify({ id: urlId, original_url: originalUrl });
    await setAsync(alias, cacheValue, "EX", 3600); // Cache for 1 hour

    // Log the redirect in the analytics table
    const geolocation = geoip.lookup(ipAddress);
    await AnalyticsModel.addLog(urlId, userAgent, ipAddress, geolocation);

    // Redirect to the original URL
    return res.redirect(originalUrl);
  } catch (err) {
    console.error("Error during redirect:", err);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleShortenUrl, handleRedirectAliasUrl };
