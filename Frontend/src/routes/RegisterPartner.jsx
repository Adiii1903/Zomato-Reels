import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const RegisterPartner = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">Partner sign up</div>
        <div className="hint">Register your restaurant to start receiving orders.</div>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input className="input" name="restaurant" placeholder="Restaurant name" />
          <input className="input" name="owner" placeholder="Owner name" />
          <input className="input" name="address" placeholder="Address" />
          <input className="input" name="email" placeholder="Business email" type="email" />
          <input className="input" name="phone" placeholder="Phone number" type="tel" />
          <input className="input" name="password" placeholder="Password" type="password" />

          <div className="row">
            <button className="btn" type="submit">Register</button>
            <Link className="link" to="/food-partner/login">Already a partner?</Link>
          </div>
        </form>

        <div className="footer-note">You will be contacted for verification after registration.</div>
      </div>
    </div>
  )
}

export default RegisterPartner
