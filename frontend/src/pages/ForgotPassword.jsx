import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../css/ForgotPassword.css";

const api = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      setLoading(true);
      const { data } = await axios.post(`${api}/forgot-password`, { email });
      setStatus({ type: "success", message: data.message });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <h2>Forgot password?</h2>
        <p className="forgot-subtitle">
          Enter your email and we'll send you a link to reset your password.
        </p>
        {status && (
          <p
            className={`forgot-status forgot-status-${status.type}`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        )}

        <div className="forgot-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoComplete="email"
            required
          />
        </div>

        <button type="submit" className="forgot-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link to="/" className="forgot-back">
          Back to login
        </Link>
      </form>
    </div>
  );
}
