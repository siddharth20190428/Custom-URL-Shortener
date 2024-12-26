// app.js
const express = require("express");
const session = require("express-session");
const passport = require("./middlewares/passport");
const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use("/auth", authRoutes);
app.use("/api", urlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
