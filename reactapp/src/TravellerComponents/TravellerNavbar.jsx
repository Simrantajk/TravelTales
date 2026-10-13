import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Components/UserContext";
import "./TravellerNavbar.css";

const TravellerNavbar = ({ onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const { username, userRole } = useUser();
  return (
    <nav className="navbar">
      <div className="navbar-title">Travel Tales</div>

      {/* Desktop Menu */}
      <div className="desktop-menu">
        <div className="nav-flex">
          <h4 className="user-info">{userRole} || {username}</h4>
          <Link to="/traveller" className="nav-link">Home</Link>
          <Link to="/traveller/view-place" className="nav-link">Place</Link>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Mobile Dropdown */}
      {showMobileMenu && (
        <div className="mobile-dropdown">
          <p className="mobile-user">Traveller || DemoTraveller</p>
          <Link to="/traveller" className="mobile-link">Home</Link>
          <Link to="/traveller/view-place" className="mobile-link">Place</Link>
          <button className="mobile-link logout-mobile" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default TravellerNavbar;