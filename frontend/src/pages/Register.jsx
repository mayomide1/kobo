import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Auth.css";
import logoName from '../assets/logoName.png'

const api = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateAccount() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || !username || !email || !password) {
      setErrorMsg("All field are required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${api}/auth/register`, {
        fullName,
        username,
        email,
        password,
      });
      setSuccessMsg(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setFullName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <img src={logoName} alt="logo" />
          <h2>Create account</h2>
        </header>

        <p className="auth-error">{errorMsg}</p>
        <p className="auth-success">{successMsg}</p>

        <div className="form-group">
          <label htmlFor="fullname">Full name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            value={email.toLowerCase()}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => handleCreateAccount()}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
