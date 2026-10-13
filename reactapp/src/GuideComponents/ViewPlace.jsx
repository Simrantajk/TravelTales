import React, { useState, useEffect } from 'react';
import GuideNavbar from './GuideNavbar';
import GlassLoader from './GlassLoader';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import './ViewPlace.css';

export default function ViewPlace() {
  const [travel, setTravel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({
    placeId: 0,
    image: '',
    name: '',
    category: '',
    location: '',
    bestTime: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/place`);
        setTravel(response.data.map(item => ({
          placeId: item.placeId,
          image: item.placeImage,
          name: item.name,
          category: item.category,
          location: item.location,
          bestTime: item.bestTimeToVisit
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditData(travel[index]);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/place/${editData.placeId}`, {
        ...editData,
        bestTimeToVisit: editData.bestTime
      });
      const updatedTravel = [...travel];
      updatedTravel[editingIndex] = editData;
      setTravel(updatedTravel);
      setShowEditModal(false);
      setShowModal(true);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/place/${travel[index].placeId}`);
      setTravel(travel.filter((_, i) => i !== index));
      setShowModal1(true);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => (window.location.href = "/login");

  return (
    <div>
     <div className="video-background">
  <video autoPlay muted loop playsInline>
      
  </video>
</div>

      <GlassLoader isLoading={isLoading} />

      <div className={`page-wrapper ${(showEditModal || showModal || showModal1 || showLogoutModal) ? 'blurred' : ''}`}>
        <GuideNavbar onLogout={handleLogout} />
        <h1>Places</h1>

        <div id="container">
          <table id="tcont">
            <thead id="theadcont">
              <tr id="trow">
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Best Time to Visit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {travel.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px", fontWeight: "bold" }}>
                    No places found
                  </td>
                </tr>
              ) : (
                travel.map((place, index) => (
                  <tr key={place.placeId}>
                    <td data-label="Image"><img src={place.image} alt={place.name} width="80" /></td>
                    <td data-label="Name">{place.name}</td>
                    <td data-label="Category">{place.category}</td>
                    <td data-label="Location">{place.location}</td>
                    <td data-label="Best Time">{place.bestTime}</td>
                    <td data-label="Action">
                      <button id="edit" onClick={() => handleEditClick(index)}>Edit</button>
                      <button id="delete" onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Place</h3>
            <form className="edit-form">
              <div className="edit-form-group">
                <label>Name:</label>
                <input name="image" value={editData.name} onChange={handleChange} />
              </div>
              <div className="edit-form-group">
                <label>Best Time to Visit:</label>
                <input name="bestTime" value={editData.bestTime} onChange={handleChange} />
              </div>
              <button type="button" className="edit-submit-btn" onClick={handleSave}>Save</button>
              <button type="button" className="close-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Place updated successfully!</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showModal1 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Place deleted successfully!</p>
            <button className="close-btn" onClick={() => setShowModal1(false)}>Close</button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to logout?</p>
            <button className="confirm-btn" onClick={confirmLogout}>Yes, Logout</button>
            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}