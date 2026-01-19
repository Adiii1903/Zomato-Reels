// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// let isConnected = false;

// async function connectToDatabase() {
//     try{
//         await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, 
//             useUnifiedTopology: true
//         });
//         isConnected = true;
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }

// //add middleware 

// app.use(async (req, res, next) => {
//     if (!isConnected) {
//         await connectToDatabase();
//     }
//     next();
// });

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;