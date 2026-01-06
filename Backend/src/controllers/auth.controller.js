
const { emit } = require("../app");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req,res){

    const { fullName, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"user already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"user register successfully",
        user:{
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })


}

async function loginUser(req, res){ 
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign({
        id:user._id,
    
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"user logged in successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName 
        }
    })
}

 function logoutUser(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message:"you are logged out now"
    });
 }

async function registerFoodPartner(req,res){
    try {
        const { name, email, password, address, ownerName, phoneNumber } = req.body; 

        if (!name || !email || !password || !address || !ownerName || !phoneNumber  ) {
            return res.status(400).json({
                message: "name, email and password are required"
            });
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        })

        if(isAccountAlreadyExists){
            return res.status(400).json({
                message:"food partner account already exists"
            })
        }   

        const hashedPassword = await bcrypt.hash(password,10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword
            ,address,
            ownerName,
            phoneNumber
        })

        const token = jwt.sign({
            id: foodPartner._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(201).json({
            message:"food partner registered successfully",
            foodPartner:{
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                ownerName: foodPartner.ownerName,
                address: foodPartner.address,
                phoneNumber: foodPartner.phoneNumber
            }
        })
    } catch (err) {
        console.error("registerFoodPartner error:", err);
        res.status(500).json({ message: err.message || "Internal server error" });
    }
}

async function loginFoodPartner(req, res){ 
    const {email, password} = req.body; 
    const foodPartner = await foodPartnerModel.findOne({
        email
    })     
    if(!foodPartner){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }   
    const isPasswordValid = await bcrypt.compare(password,foodPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }


    const token = jwt.sign({
        id:foodPartner._id,


    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"food partner logged in successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name 
        }
    })
}

 function logoutFoodPartner(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message:"you are logged out now"
    });
 }  

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}
