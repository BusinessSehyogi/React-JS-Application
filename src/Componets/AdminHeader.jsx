import React,{ useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import logo from "../Images/logo-no-background name.png";
import {
    FaBars,
    FaHome,
    FaLightbulb,
    FaEnvelope,
    FaBell,
    FaUser,
    FaPlus,
    FaCheckCircle,
    FaCompass,
    FaQuestionCircle,
    FaList
  
  } from "react-icons/fa";

  import "./Header.css"

function AdminHeader() {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSidebar = () => {
        setSidebarOpen((prev) => {
          const newValue = !prev;
          if (newValue) {
            setUserInfoOpen(false);
          }
          return newValue;
        });
      };

      const handleSearch = (event) => {
        event.preventDefault();
        const searchTerm = event.target.value; // Capture the search term
      };
    
      const handleLogout = () => {
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("Email");
        navigate("/admin/login");
      };
    
      useEffect(() => {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          navigate("/admin/login");
        }
      }, [navigate]);
    
      const handleProfileClick = () => {
        navigate("/admin/dashboard");
      };
      useEffect(() => {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          navigate("/admin/dashboard");
        }
      }, [navigate]);


  return (
    <div>
           <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {sidebarOpen ? (
          <>
            <div
              className="menu-item"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaList /> <span>User List</span>
            </div>
          

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="sidebar-icons">
            <div className="icon-container">
              <div
                className="menu-item"
                onClick={() => navigate("/founder/FounderPostHome")}
              >
                <FaHome />
              </div>
              
            </div>
          </div>
        )}
      </div>

      {/* {userInfoOpen && (
        <div className={`user-info ${userInfoOpen ? 'open' : ''}`}>
          <img className="profile-image" src={founderData.profilePic} alt="User" />
          <h2>{founderData.name}</h2>
          <p>Followers: {founderData.followers}</p>
          <p>Following: {founderData.following}</p>
          <button onClick={handleEditProfileClick}>Edit button</button>
        </div>
      )}
      {userInfoOpen && <div className="vertical-line"></div>} */}

      {/* {editProfileOpen && <EditProfileModal closeModal={handleCloseEditProfile} founderData={founderData} />} */}

      <header className="dashboard-header">
        <img src={logo} alt="Company Logo" className="company-logo" />
        <form className="search-form" onSubmit={handleSearch}>



          <input
            type="text"
            placeholder="Search for Investor or Co-Founder"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </header>
    </div>
  )
}

export default AdminHeader;