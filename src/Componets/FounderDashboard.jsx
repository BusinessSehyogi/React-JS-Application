import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FounderDashboard.css';
import logo from "../Images/logo-no-background name.png";
import { globalVariable } from "./globalVariables";
import { FaBars, FaHome, FaLightbulb, FaEnvelope, FaBell, FaUser } from 'react-icons/fa'; 
import EditProfileModal from './EditProfileModal'; 
import Header from './Header';
const FounderDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editProfileOpen, setEditProfileOpen] = useState(false); 
  const [founderData, setFounderData] = useState({ businessIdeas: [] }); // Initialize with businessIdeas

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = Number(sessionStorage.getItem("Token"));
        let url = `http://${globalVariable.value}/getPostsForFounder/${userId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFounderData({ businessIdeas: data }); // Store the fetched data
      } catch (error) {
        console.error('Error fetching founder data:', error);
      }
    };

    fetchData();
  }, []);


  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const url = `http://${globalVariable.value}/deletePost/${postId}`;
      const response = await fetch(url, {
        method: 'GET',
      });

      if (response.ok) {
        alert("Post deleted successfully!");
        setFounderData((prevData) => ({
          businessIdeas: prevData.businessIdeas.filter((idea) => idea.postId !== postId),
        }));
      } else {
        console.error("Failed to delete the post");
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post.');
    }
  };



  const handleEditProfileClick = () => {
    setEditProfileOpen(true); // Open the edit profile modal
  };

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false); // Close the edit profile modal
  };

  const handleCreatePostClick = () => {
    navigate('/CreatePost');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.value; // Capture the search term
  };

  const handleLogout = () => {
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('Email');
    navigate('/');
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleProfileClick = () => {
    // setUserInfoOpen(!userInfoOpen);
    navigate("/ProfileUpdate")
  };

  const closeModal = () => {
    setEditProfileOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        setUserInfoOpen(false);
      }
      return newValue;
    });
  };

  return (
    <div className="dashboard-container">
      {/* <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {sidebarOpen ? (
          <>
            <div className="menu-item" onClick={() => navigate('/FounderPostHome')}>
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
            <div className="menu-item" onClick={() => navigate('/ProfileUpdate')}>
              <FaUser /> <span>Profile</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="sidebar-icons">
            <div className="icon-container">
              <div className="menu-item" onClick={() => navigate('/FounderHomepage')}><FaHome /></div>
              <div className="menu-item" onClick={() => navigate('/FounderDashboard')}><FaLightbulb /></div>
              <div className="menu-item" onClick={() => navigate('/messages')}><FaEnvelope /></div>
              <div className="menu-item" onClick={() => navigate('/notifications')}><FaBell /></div>
              <div className="menu-item" onClick={handleProfileClick}><FaUser /></div>
            </div>
          </div>
        )}
      </div> */}

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

{/* <header className="dashboard-header">
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
        </header> */}

        <Header/>

      <div className="main-content-founder-dashboard">
        

        <div className="create-post-container">
          <button className="create-post-button" onClick={handleCreatePostClick}>
            Create Post
          </button>
        </div>

        <h2 className="business-ideas-title">My Business Ideas</h2>
        <div className="post-section">
          {founderData.businessIdeas && founderData.businessIdeas.length > 0 ? (
            founderData.businessIdeas.map((idea, index) => (
              <div key={index} className="post-card">
                <h3>{idea.title}</h3>
                <p>{idea.abstractContent}</p>
                <p>{idea.content}</p>
                <div className="post-stats">
                  <span>👍 {idea.likes}</span>
                  <span>👁️ {idea.views}</span>
                </div>
                {idea.images && idea.images.length > 0 && (
                  <div className="image-gallery">
                    {idea.images.map((image, imgIndex) => (
                      <img key={imgIndex} src={image} alt={`Post image ${imgIndex}`} />
                    ))}
                  </div>
                )}
                {idea.links && idea.links.length > 0 && (
                  <div className="links-list">
                    {idea.links.map((linkObj, linkIndex) => (
                      <a key={linkIndex} href={linkObj.link} target="_blank" rel="noopener noreferrer">
                        {linkObj.link}  {/* Render the link value */}
                      </a>
                    ))}
                  </div>
                )}
                <button
                  className="delete-post-button"
                  onClick={() => handleDeletePost(idea.postId)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No business ideas available</p>
          )}
        </div>
      </div>
      {/* {editProfileOpen && <EditProfileModal closeModal={handleCloseEditProfile} founderData={founderData} />} */}
    </div>
  );
};

export default FounderDashboard;
