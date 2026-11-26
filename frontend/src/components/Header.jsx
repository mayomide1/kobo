import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";

import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSettings } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";

const Header = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toLocaleDateString();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

  // close the dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setIsAvatarOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="app-header-greeting">
        <button
          className="app-header-icon-btn"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <GiHamburgerMenu />
        </button>

        <div className="app-header-text">
          <p className="app-header-title">Welcome back</p>
          <p className="app-header-date">{today}</p>
        </div>
      </div>

      <div className="app-header-actions">
        <div className="app-header-profile" ref={profileRef}>
          <button
            type="button"
            className="app-header-avatar"
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={isAvatarOpen}
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
          >
            {user?.fullname?.charAt(0)}
          </button>

          {isAvatarOpen && (
            <div className="app-header-menu" role="menu">
              <div className="app-header-menu-user">
                <p className="app-header-menu-name">{user?.fullname}</p>
                <p className="app-header-menu-handle">@{user?.username}</p>
              </div>

              <Link
                to="/settings"
                className="app-header-menu-item"
                role="menuitem"
                onClick={() => setIsAvatarOpen(false)}
              >
                <IoIosSettings /> Settings
              </Link>

              <button
                type="button"
                className="app-header-menu-item app-header-menu-logout"
                role="menuitem"
                onClick={handleLogout}
              >
                <BiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;