// require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
})

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
