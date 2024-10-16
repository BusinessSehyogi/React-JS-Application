import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../Images/logo-no-background name.png";
import { FaBars, FaHome, FaLightbulb, FaEnvelope, FaBell, FaUser } from 'react-icons/fa'; 
import "./FounderHomepage.css"


function FounderHomepage() {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [founderData, setFounderData] = useState({ businessIdeas: [] });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/api/founders'); // Adjust API endpoint as needed
            const data = await response.json();
            setFounderData(data); // Ensure data has the correct structure
          } catch (error) {
            console.error('Error fetching founder data:', error);
          }
        };
    
        fetchData();
      }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        const searchTerm = event.target.value; // Capture the search term
        // Add your search logic here, such as filtering data or making an API request
        console.log('Search term:', searchTerm);
      };
    
      const handleLogout = () => {
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('Name');
        navigate('/login');
      };
    
      const handleProfileClick = () => {
        setUserInfoOpen(!userInfoOpen);
      };
      const toggleSidebar = () => {
        setSidebarOpen((prev) => {
          const newValue = !prev;
          if (newValue) {
            setUserInfoOpen(false);
          } else {
            setUserInfoOpen(false);
          }
          return newValue;
        });
      };
    

  return (
   <div>
    <div className={`sideb ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {sidebarOpen ? (
          <>
            <div className="menu-item" onClick={() => navigate('/FounderHomepage')}>
              <FaHome /> <span>Home</span>
            </div>
            <div className="menu-item" onClick={() => navigate('/FounderDashboard')}>
              <FaLightbulb /> <span>My Ideas</span>
            </div>
            <div className="menu-item" onClick={() => navigate('/messages')}>
              <FaEnvelope /> <span>Messages</span>
            </div>
            <div className="menu-item" onClick={() => navigate('/notifications')}>
              <FaBell /> <span>Notifications</span>
            </div>
            <div className="menu-item" onClick={handleProfileClick}>
              <FaUser /> <span>Profile</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="sidebar-icons">
            <div className="icon-container">
              {/* Place icons below the toggle button */}
              <div className="menu-item" onClick={() => navigate('/')}><FaHome /></div>
              <div className="menu-item" onClick={() => navigate('//FounderDashboard')}><FaLightbulb /></div>
              <div className="menu-item" onClick={() => navigate('/messages')}><FaEnvelope /></div>
              <div className="menu-item" onClick={() => navigate('/notifications')}><FaBell /></div>
              <div className="menu-item" onClick={handleProfileClick}><FaUser /></div>
            </div>
          </div>
        )}
      </div>

      {/* User Info Section */}
      {userInfoOpen && (
        <div className={`user-info ${userInfoOpen ? 'open' : ''}`}>
          <img className="profile-image" src={founderData.profilePic} alt="User" />
          <h2>{founderData.name}</h2>
          <p>Followers: {founderData.followers}</p>
          <p>Following: {founderData.following}</p>
          <p>Subscription: {founderData.subscription}</p>
        </div>
      )}

      {/* Vertical line between sidebar and user info */}
      {userInfoOpen && <div className="vertical-line"></div>}

      {/* Main Content Section */}
      <div className="main-content">
        {/* Add the header with the logo and search bar */}
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

        <h2 className="business-ideas-title">Ideas</h2>
        <div className="post-section">
          {founderData.businessIdeas && founderData.businessIdeas.length > 0 ? (
            founderData.businessIdeas.map((idea, index) => (
              <div key={index} className="post-card">
                <img src={idea.img} alt={idea.title} />
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <div className="post-stats">
                  <span>👍 {idea.likes}</span>
                  <span>💬 {idea.comments}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No business ideas available</p>
          )}
        </div>
      </div>
   </div>
  )
}

export default FounderHomepage