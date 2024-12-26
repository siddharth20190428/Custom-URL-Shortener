const UrlModel = require("../models/urlModel");

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

module.exports = { handleShortenUrl };
