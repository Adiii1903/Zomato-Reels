import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const LoginUser = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">Welcome back — User</div>
        <div className="hint">Log in to continue ordering.</div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input className="input" name="email" placeholder="Email address" type="email" />
          <input className="input" name="password" placeholder="Password" type="password" />

          <div className="row">
            <button className="btn" type="submit">Log in</button>
            <Link className="link" to="/user/register">Create account</Link>
          </div>
        </form>

        <div className="footer-note">Forgot password? Contact support to reset.</div>
      </div>
    </div>
  )
}

export default LoginUser
