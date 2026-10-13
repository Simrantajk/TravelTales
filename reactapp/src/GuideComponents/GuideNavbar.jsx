import React, { useState } from "react";
import './GuideNavbar.css';
import { useUser } from "../Components/UserContext";
import { Link } from "react-router-dom";

function GuideNavbar({ onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { username, userRole } = useUser();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav id="nav">
      <div id="title">Travel Tales</div>

      {/* Desktop Menu */}
      <div className="desktop-menu">
        <div className="nav-flex">
          <h4 className="user-info">{userRole} || {username}</h4>
          <Link to="/guide" className="nav-link">Home</Link>
          <div className="dropdown-wrapper">
            <button className="btndrpdwn" onClick={toggleDropdown}>Place</button>
            {showDropdown && (
              <ul className="dropdown-menu show">
                <li><Link className="dropdown-item" to="/guide/add-place">Add Place</Link></li>
                <li><Link className="dropdown-item" to="/guide/view-place">View Place</Link></li>
              </ul>
            )}
          </div>
          <button id="logoutbtn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Mobile Dropdown */}
      {showMobileMenu && (
        <div className="mobile-dropdown">
          <p className="mobile-user">{userRole} || {username}</p>
          <Link to="/guide" className="mobile-link">Home</Link>
          <Link to="/guide/add-place" className="mobile-link">Add Place</Link>
          <Link to="/guide/view-place" className="mobile-link">View Place</Link>
          <button className="mobile-link logout-mobile" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default GuideNavbar;