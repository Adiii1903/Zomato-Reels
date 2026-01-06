import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const LoginPartner = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">Partner login</div>
        <div className="hint">Access your partner dashboard and manage orders.</div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input className="input" name="email" placeholder="Business email" type="email" />
          <input className="input" name="password" placeholder="Password" type="password" />

          <div className="row">
            <button className="btn" type="submit">Log in</button>
            <Link className="link" to="/food-partner/register">Register restaurant</Link>
          </div>
        </form>

        <div className="footer-note">Need help? Reach out to partner support.</div>
      </div>
    </div>
  )
}

export default LoginPartner
