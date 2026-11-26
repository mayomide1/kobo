import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Settings.css";

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* ---------- Profile ---------- */
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileStatus(null);

    if (!fullname.trim() || !username.trim()) {
      setProfileStatus({
        type: "error",
        message: "Name and username are required.",
      });
      return;
    }

    try {
      setProfileLoading(true);

      // TODO: call your API here, e.g.
      // const res = await axios.put(`${api}/user/profile`, { fullname, username }, { headers })
      // localStorage.setItem("user", JSON.stringify(res.data));
      // setProfileStatus({ type: "success", message: "Profile updated." });
    } catch (err) {
      setProfileStatus({
        type: "error",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setProfileLoading(false);
    }
  }

  /* ---------- Password ---------- */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const isPasswordMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    try {
      setPasswordLoading(true);
     await axios.put(
        `${api}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPasswordStatus({ type: "success", message: "Password changed." });
      setTimeout(() => {navigate("/")}, 1000)
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordStatus({
        type: "error",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  /* ---------- Danger zone ---------- */
  const [dangerStatus, setDangerStatus] = useState(null);

  async function handleDeleteAccount() {
    if (!window.confirm("Permanently delete your account and all its data?"))
      return;

    try {
      await axios.delete(
        `${api}/users/me`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Your account has been deleted successfully.")
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message
      setDangerStatus(backendMessage);
    }
  }

  return (
    <div className="settings">
      <main className="settings-main">
        <header className="settings-header">
          <h2>Settings</h2>
          <p>Manage your profile, password and preferences.</p>
        </header>

        <div className="settings-content">
          <section className="settings-card">
            <h3 className="settings-card-title">Profile</h3>
            <p className="settings-card-desc">
              Your name and username shown across the app.
            </p>
            <div className="divider"></div>

            <form onSubmit={handleSaveProfile}>
              <div className="settings-row">
                <div className="settings-field">
                  <label htmlFor="username">Email address</label>
                  <input
                    id="username"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="settings-field">
                  <label htmlFor="fullname">Full name</label>
                  <input
                    id="fullname"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div className="settings-field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <Status status={profileStatus} />

              <div className="settings-actions">
                <button
                  className="settings-btn settings-btn-primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          <section className="settings-card">
            <h3 className="settings-card-title">Password</h3>
            <p className="settings-card-desc">Use at least 8 characters.</p>
            <div className="divider"></div>
            <form onSubmit={handleChangePassword}>
              <div className="settings-field">
                <label htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="settings-row">
                <div className="settings-field">
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="settings-field">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              {confirmPassword.length > 0 && (
                <p
                  style={{
                    color: isPasswordMatch ? "var(--accent)" : "var(--danger)",
                  }}
                >
                  {isPasswordMatch
                    ? "Password Match"
                    : "Password does not match"}
                </p>
              )}

              <Status status={passwordStatus} />

              <div className="settings-actions">
                <button
                  className="settings-btn settings-btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </section>

          {/* ---------- Danger zone ---------- */}
          <section className="settings-card settings-card-danger">
            <h3 className="settings-card-title">Danger zone</h3>
            <p className="settings-card-desc">
              These actions cannot be undone.
            </p>
            <div className="divider"></div>
            <div className="settings-danger-row">
              <div>
                <p className="settings-danger-title">Delete account</p>
                <p className="settings-danger-text">
                  Permanently removes your account and data.
                </p>
              </div>
              <button
                type="button"
                className="settings-btn settings-btn-danger"
                onClick={handleDeleteAccount}
              >
                Delete account
              </button>
            </div>

            <Status status={dangerStatus} />
          </section>
        </div>
      </main>
    </div>
  );
};

function Status({ status }) {
  if (!status) return null;

  return (
    <p
      className={`settings-status settings-status-${status.type}`}
      role={status.type === "error" ? "alert" : "status"}
    >
      {status.message}
    </p>
  );
}

export default Settings;
