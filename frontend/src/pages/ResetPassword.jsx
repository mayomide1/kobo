import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/ResetPassword.css";

const api = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!token) {
      setStatus({
        type: "error",
        message: "This reset link is invalid. Please request a new one.",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${api}/reset-password`, {
        token,
        newPassword: password,
      });
      setStatus({
        type: "success",
        message: "Password reset successful. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="reset">
      <form className="reset-card" onSubmit={handleSubmit}>
        <h2>Set new password</h2>
        <p className="reset-subtitle">
          Choose a strong password you haven't used before.
        </p>

        <div className="reset-field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="password">Confirm new password</label>
          <input
            id="password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <span className="reset-hint">At least 8 characters.</span>
        </div>

        {status && (
          <p
            className={`reset-status reset-status-${status.type}`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        )}

        <button type="submit" className="reset-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link to="/login" className="reset-back">
          Back to login
        </Link>
      </form>
    </div>
  );
}