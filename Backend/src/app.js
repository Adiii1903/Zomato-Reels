// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// const authRoutes = require("./routes/auth.routes");
// const foodRoutes = require("./routes/food.routes");
// const foodPartnerRoutes = require("./routes/food-partner.routes");

// const app = express();

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://zomato-reels.vercel.app"
//   ],
//   credentials: true
// }));

// app.use(cookieParser());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/food", foodRoutes);
// app.use("/api/food-partner", foodPartnerRoutes);

// module.exports = app;

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

/* =======================
   CORS CONFIG (FINAL)
   ======================= */

const allowedOrigins = [
  "https://zomato-reels-frontend-yfss.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =======================
   MIDDLEWARES
   ======================= */

app.use(cookieParser());
app.use(express.json());

/* =======================
   TEST ROUTE
   ======================= */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =======================
   ROUTES
   ======================= */

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
