const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FoodView backend is running 🚀"
  });
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Food View Backend is running 🚀");
});

module.exports = app;
