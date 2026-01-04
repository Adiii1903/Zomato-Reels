const foodModel = require('../models/food.model');
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = require('express').Router();

// POST /api/food [protected]*
router.post('/',authMiddleware.authFoodPartnerMiddleware, foodController.createFood); 

module.exports = router;
