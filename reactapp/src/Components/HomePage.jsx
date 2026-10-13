import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');

    if (!storedRole) {
      navigate('/login');
    } else {
      setUsername(storedUsername || 'Guest');
      setUserRole(storedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="homepage-bg">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-title">Travel Tales ✈️</div>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <div className="nav-flex">
            <h4 className="user-info">{username} || {userRole}</h4>
            <Link to="/" className="nav-link">Home</Link>
            {userRole === 'Guide' && (
              <div className="dropdown-wrapper">
                <button className="btndrpdwn" onClick={toggleDropdown}>Place</button>
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/guide/add-place">Add Place</Link></li>
                    <li><Link className="dropdown-item" to="/guide/view-place">View Place</Link></li>
                  </ul>
                )}
              </div>
            )}
            {userRole === 'Traveller' && (
              <Link to="/traveller/view-place" className="nav-link">Explore</Link>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleDropdown}>☰</button>

        {/* Mobile Dropdown */}
        {showDropdown && (
          <div className="mobile-dropdown">
            <p className="mobile-user">{username} || {userRole}</p>
            <Link to="/" className="mobile-link">Home</Link>
            {userRole === 'Guide' && (
              <>
                <Link to="/guide/add-place" className="mobile-link">Add Place</Link>
                <Link to="/guide/view-place" className="mobile-link">View Place</Link>
              </>
            )}
            {userRole === 'Traveller' && (
              <Link to="/traveller/view-place" className="mobile-link">Explore</Link>
            )}
            <button className="mobile-link logout-mobile" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
      <img 
          src="/traveltalescoverimage.jpg" 
          alt="Travel Tales Cover" 
          className="hero-img" 
        />
        <div className="hero-overlay">
          <h2>Your Journey Begins Here...</h2>
          <p>Discover unseen places, guided by stories that stay with you.</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <p>
          Travel Tales lets you discover breathtaking destinations through curated stories,
          expert guides, and unforgettable experiences.
        </p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <h1>Contact Us</h1>
        <p>travel.support@traveltales.com</p>
      </footer>
    </div>
  );
};

export default HomePage;