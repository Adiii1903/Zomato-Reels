import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RegisterUser from "./RegisterUser.jsx";
import LoginUser from "./LoginUser.jsx";
import RegisterPartner from "./RegisterPartner.jsx";
import LoginPartner from "./LoginPartner.jsx";
import "../styles/auth.css";

const AuthChoice = () => {
    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: "center" }}>
                <div className="brand">Get started</div>
                <div className="hint">Choose how you'd like to register</div>

                <div className="form" style={{ alignItems: "stretch", gap: "12px" }}>
                    <Link to="/user/register" className="btn" style={{ display: "block", textDecoration: "none" }}>Register as User</Link>
                    <Link to="/food-partner/register" className="btn" style={{ display: "block", textDecoration: "none" }}>Register as Food Partner</Link>
                </div>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthChoice />} />
                <Route path="/user/register" element={<RegisterUser />} />
                <Route path="/user/login" element={<LoginUser />} />
                <Route path="/food-partner/register" element={<RegisterPartner />} />
                <Route path="/food-partner/login" element={<LoginPartner />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;