
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
} from "lucide-react";
import api, { getErrorMessage } from "../services/api";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signin", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;
      const token = data.token || data.accessToken;
      const user = data.user;

      if (!token || !user) {
        throw new Error(
          "Login response is missing the token or user information."
        );
      }

      if (!["ADMIN", "EMPLOYEE"].includes(user.role)) {
        throw new Error(
          "Your account does not have a supported role."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);

      navigate(user.role === "ADMIN" ? "/admin" : "/employee", {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo">
            <BriefcaseBusiness size={25} />
          </div>

          <h1>LeaveFlow</h1>
          <p>Employee Leave Management System</p>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your account.</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <div className="input-with-icon">
            <Mail size={18} />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="input-with-icon">
            <LockKeyhole size={18} />

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </p>

        <p className="login-footer">
          Secure access for administrators and employees.
        </p>
      </div>
    </div>
  );
}

export default Login;
