import React, { useState } from "react";
import "./editProfileModal.css"; // Import the CSS file for modal

const EditProfileModal = ({ closeModal }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleSendOtp = () => {
    // Simulate sending OTP
    setIsOtpSent(true); // OTP sent
  };

  const handleSave = () => {
    if (!otp) {
      alert("Please enter the OTP to proceed with the update.");
      return; // Prevent saving if OTP is not entered
    }
    closeModal(); // Close modal after saving
  };

  const handleCancel = () => {
    closeModal(); // Close modal when cancel is clicked
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>

        {/* First Name and Last Name */}
        <div className="form-row">
          <div className="form-field">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Phone Number and Profile Picture */}
        <div className="form-row">
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={handleSendOtp} className="otp-button">
              Send OTP
            </button>
          </div>
          <div className="form-field">
            <label>Profile Picture</label>
            <input type="file" onChange={handleProfilePicChange} />
            {/* Only show the message if no profile picture is selected */}
            {!profilePic && (
              <span className="file-message">No file chosen</span>
            )}
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="profile-pic-preview"
              />
            )}
          </div>
        </div>

        {isOtpSent && (
          <div className="form-row">
            <div className="form-field full-width">
              <label>OTP Verification</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
          </div>
        )}

        {/* Save and Cancel buttons */}
        <div className="modal-buttons">
          <button onClick={handleSave} disabled={!isOtpSent}>
            Save
          </button>
          <button onClick={closeModal}>Cancel</button>{" "}
          {/* This should close the modal */}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
