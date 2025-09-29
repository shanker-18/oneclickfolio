import React from 'react';
import './LoginPage.css'; // Add new styles here

const LoginPage = () => (
  <div className="login-bg">
    <div className="login-left">
      <h1 className="login-title">
        OneClick<span className="folio-gradient">Folio</span>
      </h1>
      <p className="login-desc">
        Transform your resume into a <b>stunning professional portfolio</b> with AI-powered extraction and professional design templates.
      </p>
      {/* ...existing code for features... */}
    </div>
    <div className="login-card">
      <h2 className="login-card-title">Get Started</h2>
      <form>
        <input className="login-input" type="text" placeholder="Full Name" />
        <input className="login-input" type="email" placeholder="Email Address" />
        <button className="login-btn" type="submit">
          Sign In / Sign Up &rarr;
        </button>
      </form>
      {/* ...existing code for info... */}
    </div>
  </div>
);

export default LoginPage;
