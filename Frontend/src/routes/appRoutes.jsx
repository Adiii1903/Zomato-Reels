import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister.jsx";
import UserLogin from "../pages/auth/UserLogin.jsx";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister.jsx";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin.jsx";
import "../styles/auth-shared.css";
import Home from "../pages/general/Home.jsx";

const AuthChoice = () => {
    return (
       <UserRegister/>
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthChoice />} />

                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />

                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                
                <Route path="/Home" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;