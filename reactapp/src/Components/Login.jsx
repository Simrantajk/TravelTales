import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/authSlice';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Login.css';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // field-level and API-level errors
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser } = useUser();
 
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
 
  const handleLogin = async (e) => {
    e.preventDefault();
 
    // Clear previous API error
    setErrors((prev) => ({ ...prev, api: '' }));
 
    // Trim inputs to avoid false negatives
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
 
    // Local validations
    const newErrors = {};
    if (!trimmedEmail) newErrors.email = 'Email is required';
    if (!trimmedPassword) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }
 
    if (!validateEmail(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
 
    try {
      const response = await loginUser({ email: trimmedEmail, password: trimmedPassword });
 
      // Expecting { token, userRole, username } from API
      const { token, userRole, username } = response;
 
      dispatch(setAuth({ token, userRole, username }));
      setUser({ username, userRole });
 
      // Success modal + redirect
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        if (userRole === 'Guide') navigate('/guide');
        else if (userRole === 'Traveller') navigate('/traveller');
        else navigate('/');
      }, 1600);
    } catch (error) {
      // Show backend message on UI: { status: "Failed", message: "Invalid email" }
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        'Login failed';
      setErrors((prev) => ({ ...prev, api: apiMessage }));
    }
  };
 
  return (
    <div className="login-page">
      {/* Animated sky layer */}
      <div className="sky" aria-hidden="true">
        <span className="cloud c1"></span>
        <span className="cloud c2"></span>
        <span className="cloud c3"></span>
        <span className="plane">✈️</span>
        <div className="sunset-glow"></div>
      </div>
 
      {/* Left Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1 className="site-title">Travel Tales</h1>
          <p className="site-tagline">
            Your gateway to exploring stunning destinations worldwide.
          </p>
          <p className="site-description">
            Discover curated itineraries, find your perfect getaway, and receive
            personalized recommendations tailored to your travel style and budget!
          </p>
        </div>
      </section>
 
      {/* Right Login Section */}
      <section className="login-section glass" aria-labelledby="login-title">
        <h2 id="login-title">Login</h2>
 
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: '', api: '' }));
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="error">
              {errors.email}
            </p>
          )}
 
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '', api: '' }));
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" className="error">
              {errors.password}
            </p>
          )}
 
          {/* API error banner (first failing reason) */}
          {(errors.api) && <p className="error api-error">{errors.api}</p>}
 
          <button type="submit" className="login-btn">
            <span className="btn-icon" aria-hidden="true">🛫</span>
            <span className="btn-text">Login</span>
          </button>
        </form>
 
        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </section>
 
      {/* Success Modal with Confetti */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-success-title">
          <div className="modal-content">
            <div className="confetti-container" aria-hidden="true">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    animationDelay: `${Math.random()}s`
                  }}
                />
              ))}
            </div>
            <h3 id="login-success-title">Successfully Logged In! ✈️</h3>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Login;
 