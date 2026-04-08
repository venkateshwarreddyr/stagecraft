import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import "./Login.css";

export const Login = ({ handleLogin, error }) => {
  const [focused, setFocused] = useState("");

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in-up">
        {/* Left Panel */}
        <div className="login-info">
          <div className="login-info-content">
            <h2>
              Welcome to{" "}
              <span className="gradient-text">StageCraft</span>
            </h2>
            <p>
              Sign in to access the AI-powered testing dashboard, interactive
              playground, and real-time analytics.
            </p>

            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-dot" style={{ background: "var(--accent-cyan)" }} />
                Real-time test execution monitoring
              </div>
              <div className="login-feature">
                <span className="login-feature-dot" style={{ background: "var(--accent-purple)" }} />
                AI-powered element detection
              </div>
              <div className="login-feature">
                <span className="login-feature-dot" style={{ background: "var(--accent-green)" }} />
                Automated BDD report generation
              </div>
            </div>

            <div className="login-creds-hint">
              <div className="hint-title">Demo Credentials</div>
              <div className="hint-row">
                <code>user1</code> / <code>password1</code>
                <span className="hint-badge admin">Admin</span>
              </div>
              <div className="hint-row">
                <code>user2</code> / <code>password2</code>
                <span className="hint-badge tester">Tester</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h3>Sign In</h3>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className={`form-group ${focused === "username" ? "focused" : ""}`}>
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <HiOutlineUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Enter your username"
                  required
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            <div className={`form-group ${focused === "password" ? "focused" : ""}`}>
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {error && (
              <div className="login-error error">
                <HiOutlineExclamationTriangle />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary login-submit-btn">
              Sign In <HiOutlineArrowRight />
            </button>
          </form>

          <div className="login-footer">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
