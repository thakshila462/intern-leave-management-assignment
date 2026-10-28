
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  UserRound,
  Mail,
  LockKeyhole,
  Building2,
} from "lucide-react";

import api, { getErrorMessage } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.department
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department,
      });

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="signup-card">
        {/* Brand */}

        <div className="login-brand">
          <div className="brand-logo">
            <BriefcaseBusiness size={25} />
          </div>

          <h1>LeaveFlow</h1>

          <p>Employee Leave Management System</p>
        </div>

        {/* Heading */}

        <div className="login-heading">
          <h2>Create Account</h2>

          <p>Register to manage your leave requests.</p>
        </div>

        {/* Messages */}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        {/* Signup Form */}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>

          <div className="input-with-icon">
            <UserRound size={18} />

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

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
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="department">Department</label>

          <div className="input-with-icon">
            <Building2 size={18} />

            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              <option value="IT">IT</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <label htmlFor="password">Password</label>

          <div className="input-with-icon">
            <LockKeyhole size={18} />

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <div className="input-with-icon">
            <LockKeyhole size={18} />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button login-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}

        <p className="login-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </p>

        <p className="login-footer">
          Employee registration portal.
        </p>
      </div>
    </div>
  );
}

export default Signup;
