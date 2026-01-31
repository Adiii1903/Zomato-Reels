const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

const FRONTEND_URL = "https://zomato-reels-frontend-yfss.onrender.com";

/* ======================
   HARD CORS HANDLER
   ====================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // 🔴 THIS LINE FIXES EVERYTHING
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ======================
   MIDDLEWARES
   ====================== */
app.use(cookieParser());
app.use(express.json());

/* ======================
   ROUTES
   ====================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
