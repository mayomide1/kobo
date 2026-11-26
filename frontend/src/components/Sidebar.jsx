import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import logoName from "../assets/logoName.png";

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdClose,
} from "react-icons/md";
import { MdHome } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaList } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user || !token) navigate("/");
  }, [user, token, navigate]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleNavClick() {
    if (window.matchMedia("(max-width: 768px)").matches) onClose();
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

  if (!user || !token) return null;

  return (
    <aside className={`sb ${isOpen ? "sb--open" : ""}`} aria-hidden={!isOpen}>
      <nav className="sb-nav">
        <button
          className="sb-close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <MdClose /> Close
        </button>
        <img src={logoName} alt="logo" />

        <NavLink className="sb-link" to="/dashboard" onClick={handleNavClick}>
          <MdHome style={{ fontSize: 20 }} /> Dashboard
        </NavLink>
        <NavLink
          className="sb-link"
          to="/add-transaction"
          onClick={handleNavClick}
        >
          <IoMdAdd style={{ fontSize: 20 }} /> Add Transaction
        </NavLink>
        <NavLink
          className="sb-link"
          to="/transactions"
          onClick={handleNavClick}
        >
          <FaList style={{ fontSize: 20 }} /> Transactions
        </NavLink>
        <NavLink className="sb-link" to="/settings" onClick={handleNavClick}>
          <IoIosSettings style={{ fontSize: 20 }} /> Settings
        </NavLink>
      </nav>

      <div className="sb-profile" ref={profileRef}>
        {menuOpen && (
          <div className="sb-menu" role="menu">
            <button
              className="sb-menu-item"
              role="menuitem"
              onClick={handleLogout}
            >
              Log out @{user.username}
            </button>
          </div>
        )}

        <button
          className="sb-profile-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sb-avatar">{user.fullname?.charAt(0)}</span>
          <span className="sb-user">
            <span className="sb-name">{user.fullname}</span>
            <span className="sb-handle">@{user.username}</span>
          </span>
          <span className="sb-dots" aria-hidden="true">
            {menuOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
