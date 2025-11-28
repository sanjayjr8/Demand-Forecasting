import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/Forms/AuthForm.css";
import { useLogin } from "../../hooks/useLogin";
import Loader from "../loaders/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  // check if form is filled
  const isFormFilled = () => email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2 className="sora">Login</h2>
        <form onSubmit={handleSubmit}>
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
            title="Login"
            isLoading={isLoading && isFormFilled()}
            disabled={isLoading}
            type="submit"
          />

          {/* New: waking up message while loading */}
          {isLoading && isFormFilled() && (
            <div className="login-waking">
              <span className="login-spinner" />
              <span>Waking up the server.... This may take a few seconds because we are using a free instance. Once ready, you should be able to log in. </span>
            </div>
          )}

          {error && <div>{error}</div>}
        </form>
        <p className="outfit">
          Don't have an account? <Link to="/auth/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
