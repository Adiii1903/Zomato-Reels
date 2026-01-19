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

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI not defined");
    }

    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
