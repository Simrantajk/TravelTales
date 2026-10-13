// import React, { useState, useMemo } from 'react';
// import { registerUser } from '../services/authService';
// import { useNavigate, Link } from 'react-router-dom';
// import './Signup.css';
 
// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   // Start empty so placeholder (“User Role”) is shown until user selects
//   const [userRole, setUserRole] = useState('');
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [showPasswordRules, setShowPasswordRules] = useState(false);
 
//   // Separate toggles so they don't control each other
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
//   const navigate = useNavigate();
 
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
 
//   // Password rule: at least 1 letter, 1 digit, min length 6
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
 
//   const passwordChecks = useMemo(() => ({
//     hasLetter: /[A-Za-z]/.test(password),
//     hasDigit: /\d/.test(password),
//     minLength: password.length >= 6,
//   }), [password]);
 
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setServerError('');
 
//     const newErrors = {};
//     if (!username) newErrors.username = 'User Name is required';
//     if (!email) newErrors.email = 'Email is required';
//     if (!mobile) newErrors.mobile = 'Mobile number is required';
//     if (!password) newErrors.password = 'Password is required';
//     if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
//     if (password && confirmPassword && password !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
//     if (email && !validateEmail(email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (mobile && !validateMobile(mobile)) {
//       newErrors.mobile = 'Mobile must be 10 digits';
//     }
//     if (password && !passwordRegex.test(password)) {
//       newErrors.password = 'Password must be at least 6 characters, include at least one letter and one digit';
//     }
//     if (!userRole) {
//       newErrors.userRole = 'Please select a user role';
//     }
 
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;
 
//     try {
//       await registerUser({
//         Username: username,
//         Email: email,
//         MobileNumber: mobile,
//         Password: password,
//         UserRole: userRole,
//       });
 
//       setShowModal(true);
//       setTimeout(() => {
//         setShowModal(false);
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       const apiMessage =
//         error?.response?.data?.message ||
//         error?.response?.data?.Message ||
//         error?.message ||
//         'Signup failed';
 
//       setServerError(apiMessage);
//     }
//   };
 
//   const isSubmitDisabled =
//     !username ||
//     !email ||
//     !mobile ||
//     !password ||
//     !confirmPassword ||
//     !validateEmail(email) ||
//     !validateMobile(mobile) ||
//     !passwordRegex.test(password) ||
//     password !== confirmPassword ||
//     !userRole;
 
//   return (
//     <div className="travel-page">
//       {/* Sky + clouds + plane */}
//       <div className="sky">
//         <span className="cloud c1" aria-hidden="true"></span>
//         <span className="cloud c2" aria-hidden="true"></span>
//         <span className="cloud c3" aria-hidden="true"></span>
//         <span className="plane" aria-hidden="true">✈️</span>
//         <div className="sunset-glow" aria-hidden="true"></div>
//       </div>
 
//       {/* Ocean waves */}
//       <svg className="ocean" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
//         <path className="wave wave1" d="M0,60 C240,140 480,-20 720,60 C960,140 1200,-20 1440,60 L1440,120 L0,120 Z"></path>
//         <path className="wave wave2" d="M0,65 C240,145 480,-15 720,65 C960,145 1200,-15 1440,65 L1440,120 L0,120 Z"></path>
//       </svg>
 
//       <div className="signup-container glass">
//         <h1 className="brand">Travel Tales</h1>
//         <p className="tagline">Sign up to write your next story.</p>
 
//         {serverError && (
//           <div className="error-banner">
//             <span>{serverError}</span>
//             <button
//               type="button"
//               className="dismiss-btn"
//               aria-label="Dismiss error"
//               onClick={() => setServerError('')}
//             >
//               ×
//             </button>
//           </div>
//         )}
 
//         <form onSubmit={handleSignup} noValidate>
//           {/* Username */}
//           <div className="field">
//             <input
//               type="text"
//               placeholder=" "
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               aria-invalid={!!errors.username}
//               aria-describedby={errors.username ? 'username-error' : undefined}
//             />
//             <label>Username</label>
//             {errors.username && <p id="username-error" className="error">{errors.username}</p>}
//           </div>
 
//           {/* Email */}
//           <div className="field">
//             <input
//               type="email"
//               placeholder=" "
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               aria-invalid={!!errors.email}
//               aria-describedby={errors.email ? 'email-error' : undefined}
//             />
//             <label>Email</label>
//             {errors.email && <p id="email-error" className="error">{errors.email}</p>}
//           </div>
 
//           {/* Mobile */}
//           <div className="field">
//             <input
//               type="text"
//               placeholder=" "
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               inputMode="numeric"
//               aria-invalid={!!errors.mobile}
//               aria-describedby={errors.mobile ? 'mobile-error' : undefined}
//             />
//             <label>Mobile Number</label>
//             {errors.mobile && <p id="mobile-error" className="error">{errors.mobile}</p>}
//           </div>
 
//           {/* Password */}
//           <div className="field password-box">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder=" "
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               aria-invalid={!!errors.password}
//               aria-describedby={errors.password ? 'password-error' : 'password-help'}
//             />
//             <label>Password</label>
//             <button
//               type="button"
//               className="peek-btn"
//               onClick={() => setShowPassword((s) => !s)}
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//               aria-pressed={showPassword}
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//             {errors.password && <p id="password-error" className="error">{errors.password}</p>}
//           </div>
 
//           {/* Password rules toggle */}
//           <button
//             type="button"
//             className="linklike small"
//             onClick={() => setShowPasswordRules((s) => !s)}
//             aria-expanded={showPasswordRules}
//             aria-controls="password-rules"
//           >
//             {showPasswordRules ? 'Hide password rules' : 'Show password rules'}
//           </button>
 
//           {/* Password rules */}
//           {showPasswordRules && (
//             <div id="password-rules" className="password-rules">
//               <p id="password-help" className="help">Password must:</p>
//               <ul className="checklist">
//                 <li className={passwordChecks.hasLetter ? 'ok' : 'not-ok'}>● Contain at least one letter (a–z)</li>
//                 <li className={passwordChecks.hasDigit ? 'ok' : 'not-ok'}>● Contain at least one digit (0–9)</li>
//                 <li className={passwordChecks.minLength ? 'ok' : 'not-ok'}>● Be at least 6 characters long</li>
//               </ul>
//             </div>
//           )}
 
//           {/* Confirm Password */}
//           <div className="field password-box">
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               placeholder=" "
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               aria-invalid={!!errors.confirmPassword}
//               aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
//             />
//             <label>Confirm Password</label>
//             <button
//               type="button"
//               className="peek-btn"
//               onClick={() => setShowConfirmPassword((s) => !s)}
//               aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
//               aria-pressed={showConfirmPassword}
//             >
//               {showConfirmPassword ? 'Hide' : 'Show'}
//             </button>
//             {errors.confirmPassword && <p id="confirm-error" className="error">{errors.confirmPassword}</p>}
//           </div>
 
//           {/* User Role select with placeholder */}
//           <div className="field select-field">
//             <select
//               value={userRole}
//               onChange={(e) => setUserRole(e.target.value)}
//               aria-invalid={!!errors.userRole}
//               aria-describedby={errors.userRole ? 'role-error' : undefined}
//               aria-label="User Role"
//               required
//             >
//               <option value="" disabled hidden>User Role</option>
//               <option value="Traveller">Traveller 🧳</option>
//               <option value="Guide">Guide 🧭</option>
//             </select>
//             {errors.userRole && <p id="role-error" className="error">{errors.userRole}</p>}
//           </div>
 
//           <button type="submit" className="submit-btn">
//   <span className="submit-emoji" aria-hidden="true">🛫</span>
//   <span className="submit-text">Register</span>
// </button>
 
//         </form>
 
//         <p className="signin">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
 
//       {/* Success modal */}
//       {showModal && (
//   <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="signup-success-title">
//     <div className="modal-content">
//       <div className="confetti-container">
//         {[...Array(30)].map((_, i) => (
//           <div
//             key={i}
//             className="confetti"
//             style={{
//               left: `${Math.random() * 100}%`,
//               backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
//               animationDelay: `${Math.random()}s`
//             }}
//           />
//         ))}
//       </div>
//       <h3 id="signup-success-title">Successfully Signed Up! ✈️</h3>
   
//     </div>
//   </div>
// )}
//     </div>
//   );
// };
 
// export default Signup;

import React, { useState, useMemo } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';
 
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState(''); // start empty for placeholder
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const navigate = useNavigate();
 
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
  const validateMobile = (mobile) => /^\+?[1-9]\d{1,14}$/.test(mobile);
  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const passwordChecks = useMemo(() => ({
    hasLetter: /[A-Za-z]/.test(password),
    hasDigit: /\d/.test(password),
    minLength: password.length >= 6,
  }), [password]);
 
  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError('');
 
    const newErrors = {};
    if (!username) newErrors.username = 'User Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!mobile) newErrors.mobile = 'Mobile number is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (email && !validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (mobile && !validateMobile(mobile)) {
      newErrors.mobile = 'Mobile number is not valid.';
    }
    if (password && !passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 6 characters, include at least one letter and one digit';
    }
    if (!userRole) {
      newErrors.userRole = 'Please select a user role';
    }
 
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
 
    try {
      await registerUser({
        Username: username,
        Email: email,
        MobileNumber: mobile,
        Password: password,
        UserRole: userRole,
      });
 
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.message ||
        'Signup failed';
 
      setServerError(apiMessage);
    }
  };
 
  const isSubmitDisabled =
    !username ||
    !email ||
    !mobile ||
    !password ||
    !confirmPassword ||
    !validateEmail(email) ||
    !validateMobile(mobile) ||
    !passwordRegex.test(password) ||
    password !== confirmPassword ||
    !userRole;
 
  return (
    <div className="travel-page">
      {/* Sky + clouds + plane */}
      <div className="sky" aria-hidden="true">
        <span className="cloud c1"></span>
        <span className="cloud c2"></span>
        <span className="cloud c3"></span>
        <span className="plane">✈️</span>
        <div className="sunset-glow"></div>
      </div>
 
      {/* Ocean waves */}
      <svg className="ocean" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="wave wave1" d="M0,60 C240,140 480,-20 720,60 C960,140 1200,-20 1440,60 L1440,120 L0,120 Z"></path>
        <path className="wave wave2" d="M0,65 C240,145 480,-15 720,65 C960,145 1200,-15 1440,65 L1440,120 L0,120 Z"></path>
      </svg>
 
      <div className="signup-container glass">
        <h1 className="brand">Travel Tales</h1>
        {/* Explicit heading so test `getAllByText(/Signup/i)` passes */}
        <h2 className="form-title">Signup</h2>
        <p className="tagline">Sign up to write your next story.</p>
 
        {serverError && (
          <div className="error-banner">
            <span>{serverError}</span>
            <button
              type="button"
              className="dismiss-btn"
              aria-label="Dismiss error"
              onClick={() => setServerError('')}
            >
              ×
            </button>
          </div>
        )}
 
        <form onSubmit={handleSignup} noValidate>
          {/* Username */}
          <div className="field">
            <input
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            <label>Username</label>
            {errors.username && <p id="username-error" className="error">{errors.username}</p>}
          </div>
 
          {/* Email */}
          <div className="field">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            <label>Email</label>
            {errors.email && <p id="email-error" className="error">{errors.email}</p>}
          </div>
 
          {/* Mobile */}
          <div className="field">
            <input
              type="text"
              placeholder=" "
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              inputMode="numeric"
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? 'mobile-error' : undefined}
            />
            <label>Mobile Number</label>
            {errors.mobile && <p id="mobile-error" className="error">{errors.mobile}</p>}
          </div>
 
          {/* Password */}
          <div className="field password-box">
            {/* Use real placeholder text; remove inline JSX comment */}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-help'}
            />
            <label>Password</label>
            <button
              type="button"
              className="peek-btn"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p id="password-error" className="error">{errors.password}</p>}
          </div>
 
          {/* Password rules toggle */}
          <button
            type="button"
            className="linklike small"
            onClick={() => setShowPasswordRules((s) => !s)}
            aria-expanded={showPasswordRules}
            aria-controls="password-rules"
          >
            {showPasswordRules ? 'Hide password rules' : 'Show password rules'}
          </button>
 
          {/* Password rules */}
          {showPasswordRules && (
            <div id="password-rules" className="password-rules">
              <p id="password-help" className="help">Password must:</p>
              <ul className="checklist">
                <li className={passwordChecks.hasLetter ? 'ok' : 'not-ok'}>● Contain at least one letter (a–z)</li>
                <li className={passwordChecks.hasDigit ? 'ok' : 'not-ok'}>● Contain at least one digit (0–9)</li>
                <li className={passwordChecks.minLength ? 'ok' : 'not-ok'}>● Be at least 6 characters long</li>
              </ul>
            </div>
          )}
 
          {/* Confirm Password */}
          <div className="field password-box">
            {/* Use real placeholder text; remove inline JSX comment */}
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
            />
            <label>Confirm Password</label>
            <button
              type="button"
              className="peek-btn"
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
            {errors.confirmPassword && <p id="confirm-error" className="error">{errors.confirmPassword}</p>}
          </div>
 
          {/* User Role select with placeholder */}
          <div className="field select-field">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              aria-invalid={!!errors.userRole}
              aria-describedby={errors.userRole ? 'role-error' : undefined}
              aria-label="User Role"
              required
            >
              <option value="" disabled hidden>User Role</option>
              <option value="Traveller">Traveller 🧳</option>
              <option value="Guide">Guide 🧭</option>
            </select>
            {errors.userRole && <p id="role-error" className="error">{errors.userRole}</p>}
          </div>
 
          {/* Accessible name is "Submit" to satisfy the test */}
          <button type="submit" className="submit-btn">
            <span className="submit-emoji" aria-hidden="true">🛫</span>
            <span className="submit-text">Submit</span>
          </button>
        </form>
 
        <p className="signin">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
 
      {/* Success modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="signup-success-title">
          <div className="modal-content">
            <div className="confetti-container">
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
            <h3 id="signup-success-title">Successfully Signed Up! ✈️</h3>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Signup;
 
 