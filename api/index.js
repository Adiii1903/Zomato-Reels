import { connectDB } from "../db/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "FoodView backend is running 🚀"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}