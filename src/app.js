const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "API is healthy 🚀" });
});

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
