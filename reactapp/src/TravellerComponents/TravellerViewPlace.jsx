import React, { useState, useEffect } from "react";
import axios from "axios";
import TravellerNavbar from "./TravellerNavbar";
import "./TravellerViewPlace.css";
import API_BASE_URL from "../apiConfig";

const TravellerViewPlace = () => {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/place`)
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }, []);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => (window.location.href = "/login");

  return (
    <>
    <div className={`page-wrapper ${showLogoutModal ? "blurred" : ""}`}>
  <TravellerNavbar onLogout={handleLogout} />
  <div className="container">
    <h1>Available Places</h1>
    <div className="search-container">
      <input
        type="text"
        placeholder="Search places..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
    </div>

    <table className="places-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Location</th>
          <th>Best Time to Visit</th>
        </tr>
      </thead>
      <tbody>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <tr key={index}>
              <td data-label="Image">
                <img src={place.placeImage} alt={place.name} />
              </td>
              <td data-label="Name">{place.name}</td>
              <td data-label="Category">{place.category}</td>
              <td data-label="Location">{place.location}</td>
              <td data-label="Best Time">{place.bestTimeToVisit}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="no-data">
              Oops! No places found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to logout?</p>
            <button className="confirm-btn" onClick={confirmLogout}>
              Yes, Logout
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TravellerViewPlace;