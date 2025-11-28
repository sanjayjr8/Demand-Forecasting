import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/Forms/AuthForm.css";
import { useSignup } from "../../hooks/useSignup";
import Loader from "../loaders/Loader";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTransition, setShowTransition] = useState(false);

  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(username, email, password);
  };

  // check if form is filled
  const isFormFilled = () => username && email && password;

  const handleLoginClick = () => {
    if (showTransition) return; // avoid double-click
    setShowTransition(true);

    // must match animation duration in CSS (1200ms)
    setTimeout(() => {
      navigate("/auth/login");
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2 className="sora">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="outfit"
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="outfit"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="outfit"
            disabled={isLoading}
          />
          <Loader
            title="Sign up"
            isLoading={isLoading && isFormFilled()}
            disabled={isLoading}
            type="submit"
          />

          {/* same waking-up message as login */}
          {isLoading && isFormFilled() && (
            <div className="login-waking">
              <span className="login-spinner" />
              <span>Waking up the server...... This may take a few seconds because we are using a free instance. Once ready, you should be able to log in.</span>
            </div>
          )}

          {error && <div>{error}</div>}
        </form>

        <p className="outfit auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link-button"
            onClick={handleLoginClick}
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </div>

      {/* green–orange lorry transition overlay */}
      {showTransition && (
        <div className="truck-overlay">
          <div className="truck">
            <div className="truck-body" />
            <div className="truck-cabin" />
            <div className="truck-wheel wheel-left" />
            <div className="truck-wheel wheel-right" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
