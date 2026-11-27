import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Auth.css";
import logoName from '../assets/logoName.png'

import { FcGoogle } from "react-icons/fc";

const api = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMsg("")
    setSuccessMsg("")
    if (!email || !password === "") {
      setErrorMsg("All field are required");
    }
    try {
      setLoading(true);
      const response = await axios.post(`${api}/auth/login`, { email, password });
      setSuccessMsg(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setEmail("");
      setPassword("");
      setTimeout (() => navigate("/dashboard"), 1000);
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
          <h2>Welcome back!</h2>
          <p>Start managing your finance smarter and better.</p>
        </header>

        {/* <div className="social-buttons">
          <button className="btn btn-social"><FcGoogle /> Continue with Google</button>
        </div> */}

        {/* <p className="divider">or</p> */}
        
        <p className="auth-error">{errorMsg}</p>
        <p className="auth-success">{successMsg}</p>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email.toLowerCase()}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p className="forgot-password" onClick={() => navigate("/forgot-password")}>Forgot password?</p>

        <button className="btn btn-primary" onClick={() => handleLogin()}>
          {loading ? "Logging in...": "Login"}
        </button>

        <p className="divider"></p>

        <p className="auth-footer">
          Dont have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;