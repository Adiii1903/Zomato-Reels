const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

/* =========================
   HARD CORS FIX (FINAL)
   ========================= */

const ALLOWED_ORIGIN = "https://zomato-reels-frontend-yfss.onrender.com";

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === ALLOWED_ORIGIN) {
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

  // 🔴 THIS IS THE MOST IMPORTANT LINE
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   MIDDLEWARES
   ========================= */

app.use(cookieParser());
app.use(express.json());

/* =========================
   TEST ROUTE
   ========================= */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   ROUTES
   ========================= */

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
