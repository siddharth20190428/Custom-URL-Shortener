// controllers/authController.js
const userModel = require("../models/userModel");

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, photos } = profile;
  const email = emails[0].value;
  const profilePicture = photos[0].value;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findUserByGoogleId(id);

    if (existingUser) {
      // User exists, return the user
      return done(null, existingUser);
    } else {
      // User does not exist, create a new user
      const newUser = await userModel.createUser(
        id,
        displayName,
        email,
        profilePicture
      );
      return done(null, newUser);
    }
  } catch (err) {
    console.error("Error saving user to database:", err);
    return done(err);
  }
};

module.exports = {
  handleGoogleLogin,
};
