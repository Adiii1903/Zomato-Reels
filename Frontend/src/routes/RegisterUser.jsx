import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const RegisterUser = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">Create account — User</div>
        <div className="hint">Sign up to start ordering delicious food.</div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input className="input" name="fullname" placeholder="Full name" />
          <input className="input" name="email" placeholder="Email address" type="email" />
          <input className="input" name="password" placeholder="Password" type="password" />

          <div className="row">
            <button className="btn" type="submit">Sign up</button>
            <Link className="link" to="/user/login">Already have an account?</Link>
          </div>
        </form>

        <div className="footer-note">By continuing you agree to our terms and privacy.</div>
      </div>
    </div>
  )
}

export default RegisterUser
