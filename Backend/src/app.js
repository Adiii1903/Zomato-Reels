const express = require("express");
const cookieParser = require("cookie-parser");
const zlib = require("zlib");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

const FRONTEND_URL = "https://zomato-reels-frontend-yfss.onrender.com";
                        

/* ======================
   FINAL CORS FIX
   ====================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 🔴 THIS LINE WAS MISSING BEFORE
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length");

  // Handle preflight
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

app.use((req, res, next) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  if (!acceptEncoding.includes("gzip")) {
    return next();
  }

  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    const body = Buffer.from(JSON.stringify(payload));
    const compressed = zlib.gzipSync(body);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", compressed.length);
    return res.send(compressed);
  };

  next();
});

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
