import './PlaceForm.css';
import axios from "axios";
import React, { useState } from 'react';
import GuideNavbar from './GuideNavbar';
import API_BASE_URL from '../apiConfig';

export default function PlaceForm() {
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [time, setTime] = useState('');
  const [loc, setLoc] = useState('');
  const [imag, setImage] = useState('');

  const [nameerr, setNameErr] = useState('');
  const [caterr, setCatErr] = useState('');
  const [timeerr, setTimeErr] = useState('');
  const [locerr, setLocErr] = useState('');
  const [imgerr, setImageErr] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImage(reader.result);
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setImage('');
      };
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameErr('');
    setCatErr('');
    setTimeErr('');
    setLocErr('');
    setImageErr('');

    let handleError = false;

    if (name.trim() === "") { setNameErr("Name is required"); handleError = true; }
    if (cate.trim() === "") { setCatErr("Category is required"); handleError = true; }
    if (time.trim() === "") { setTimeErr("Best Time to Visit is required"); handleError = true; }
    if (loc.trim() === "") { setLocErr("Location is required"); handleError = true; }
    if (imag.trim() === "") { setImageErr("Place Image is required"); handleError = true; }

    if (handleError) return;

    const places = {
      name,
      category: cate,
      bestTimeToVisit: time,
      location: loc,
      placeImage: imag
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/place`, places, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Success:", response.data);
      setShowModal(true);
      setName(''); setCate(''); setTime(''); setLoc(''); setImage('');
    } catch (error) {
      console.error("Error adding place:", error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => (window.location.href = "/login");

  return (
    <>
      <GuideNavbar onLogout={handleLogout} />
      <div className="place-form-container">
        <h2>Create New Place</h2>
        <form className="place-form" onSubmit={submitHandler}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="placeName">Name<span style={{ color: "red" }}>*</span></label>
            <input type="text" id="placeName" value={name} onChange={e => setName(e.target.value)} />
          </div>
          {nameerr && <p style={{ color: "red" }}>{nameerr}</p>}

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category<span style={{ color: "red" }}>*</span></label>
            <select id="category" value={cate} onChange={e => setCate(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Beach">Beach</option>
              <option value="Countryside">Countryside</option>
              <option value="City">City</option>
              <option value="Historical">Historical</option>
            </select>
          </div>
          {caterr && <p style={{ color: "red" }}>{caterr}</p>}

          {/* Best Time to Visit */}
          <div className="form-group">
            <label htmlFor="description">Best Time to Visit<span style={{ color: "red" }}>*</span></label>
            <textarea id="description" value={time} onChange={e => setTime(e.target.value)}></textarea>
          </div>
          {timeerr && <p style={{ color: "red" }}>{timeerr}</p>}

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location<span style={{ color: "red" }}>*</span></label>
            <input type="text" id="location" value={loc} onChange={e => setLoc(e.target.value)} />
          </div>
          {locerr && <p style={{ color: "red" }}>{locerr}</p>}

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="placeImageFile">Place Image<span style={{ color: "red" }}>*</span></label>
            <input type="file" id="placeImageFile" accept="image/*" onChange={handleFileChange} />
          </div>
          {imgerr && <p style={{ color: "red" }}>{imgerr}</p>}

          <button type="submit" className="submit-btn">Add Place</button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Place added successfully!</p>
              <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to logout?</p>
              <button className="confirm-btn" onClick={confirmLogout}>Yes, Logout</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
