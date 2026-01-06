const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuidv4 } = require('uuid');



async function createFood(req, res) { 
    console.log("req.foodpartner:", req.foodpartner);
    console.log(req.body);
    console.log("req.file:", req.file);

    if (!req.foodpartner || !req.foodpartner._id) {
        return res.status(400).json({ message: 'Food partner info missing' });
    }

    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'File not provided' });
    }

    try {
            const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuidv4(), req.file.mimetype);

        const foodItem = await foodModel.create({
            foodItename: req.body.name || req.body.foodItename,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodpartner._id
        });

        console.log("fileUploadResult:", fileUploadResult);

        return res.status(201).json({
            message: "Food item created successfully",
            food: foodItem
        });
    } catch (err) {
        console.error('createFood error:', err);
        return res.status(500).json({ message: 'Could not create food item', error: err.message || err });
    }
}

module.exports ={
    createFood
}
