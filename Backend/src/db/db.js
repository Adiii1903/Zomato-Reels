// const mongoose = require('mongoose');



// function connectDB() {
//     mongoose.connect(process.env.MONGODB_URI)
//         .then(() => {
//             console.log("MongoDB connected");
//         })
//         .catch((err) => {
//             console.log("MongoDB connection error:", err);
//         })
// }

// module.exports = connectDB;


const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env file");
  }

  await mongoose.connect(mongoUri);
  isConnected = true;

  console.log(" MongoDB connected");
};

module.exports = connectDB;

