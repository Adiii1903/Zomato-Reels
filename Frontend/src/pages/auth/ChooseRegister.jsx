import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card choose-register-card" role="region" aria-labelledby="choose-register-title">
        
        <header className="auth-header">
          <h1 id="choose-register-title" className="auth-title">
            Create your account
          </h1>
          <p className="auth-subtitle">
            Choose how you want to join our platform
          </p>
        </header>

        <div className="choose-register-actions">
          <Link to="/user/register" className="auth-btn primary">
            Register as User
          </Link>

          <Link to="/food-partner/register" className="auth-btn secondary">
            Register as Food Partner
          </Link>
        </div>

        <div className="auth-alt-action">
          Already have an account?
          <Link to="/user/login"> Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default ChooseRegister;
