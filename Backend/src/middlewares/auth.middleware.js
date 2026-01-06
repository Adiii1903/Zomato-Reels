const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const JWT = require('jsonwebtoken');

async function authFoodPartnerMiddleware(req, res, next) {
    
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access — please login"
            });
        }
        try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET); // or process.env.JWT_SECRET
        const foodpartner = await foodPartnerModel.findById(decoded.id);

        if (!foodpartner) {
            return res.status(401).json({ message: "Invalid token: user not found" });
        }

        req.foodpartner = foodpartner;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access — invalid token"
        });
    }
}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access — please login"
        });
    }       

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);  

        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access — invalid token"
        });
    }

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};     
