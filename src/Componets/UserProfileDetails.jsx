import React, { useState, useEffect } from "react";
import "./UserProfileDetails.css"
import Header from "./Header";
import { globalVariable } from "./globalVariables";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


function UserProfileDetails () {
//     let userId = Number(sessionStorage.getItem("Token"));
//   let email = sessionStorage.getItem("Email");

const location = useLocation(); // Access location object
  const email = location.state?.email; // Retrieve the user data from state

    const [user, setUser] = useState(null); // State to store user data
    const [showPopup, setShowPopup] = useState(false);
    const [founderData, setFounderData] = useState({ businessIdeas: [] });

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://${globalVariable.value}/getUser/${email}`); // Use userId in API
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUser(data);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUserData();
      }, [email]);

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
      
  return (
    <div>
        <Header/>
        <div className="profile-container">
        {user ? (
          <>
            <div className="profile-header">
              <img src={user.image || "default-avatar.png"} alt="Profile" className="profile-pic" />
              <h1>{user.firstName} {user.lastName}</h1>
            </div>
            <div className="profile-stats">
                <div className="profile-connections">
                <p>Connections: {user.noOfConnections}</p>
                <div className="profile-connections-two">
                <p>Contact Info:
              <button onClick={() => setShowPopup(true)}>My contact Info</button>
              </p>

                </div>
              

                </div>
              
              
            </div>
            
            <div className="profile-contact">
            <p>Posts:</p>
            <div className="post-section-userprofile">
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
                
              </div>
            ))
          ) : (
            <p>No business ideas available</p>
          )}
        </div>
              
              
            </div>
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h2>Contact Information</h2>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
    </div>

    </div>
  )
}

export default UserProfileDetails;