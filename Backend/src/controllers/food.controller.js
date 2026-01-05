const foodModel = require('../models/food.model');



async function createFood(req, res) { 
    console.log("req.foodpartner:", req.foodpartner);
    console.log(req.body);
    console.log("req.file:", req.file);

    res.send("Create food endpoint reached");
}


module.exports ={
    createFood
}
