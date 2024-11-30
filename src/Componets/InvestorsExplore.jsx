import React, { useState,useEffect } from "react";
import InvestorHeader from "./InvestorHeader";
import "./Explore.css"; // Add styles for the search bar
import { globalVariable } from "./globalVariables";
import {  useNavigate } from "react-router-dom";

function InvestorsExplore() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    photo: "",
  });

  let userId = Number(sessionStorage.getItem("Token"));
  let email = sessionStorage.getItem("Email");
  let data;


  const handleSearch = (query) => {
    setSearchQuery(query);
   
    const filtered = users.filter((user) =>
      user.firstName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleConnect = (userId) => {
    // Add logic to handle connection (e.g., send a connection request)
  };

  const UserDetails =(email)=>{
    navigate("/founder/UserProfileDetails", { state: { email } }); 
    
  }

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const url = `http://${globalVariable.value}/getUsers`; // Update endpoint
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const users = await response.json();
  
        // Optionally, update state to display users in UI
        setFormData(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
  
    fetchAllUsers();
  }, []);

  return (
    <div className="explore-container">
      <InvestorHeader/>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for Founders or Investors"
          value={searchQuery}
          onChange={(e) =>  handleSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={() => console.log(`Searching for: ${searchQuery}`)}
         className="search-button">
          Search
        </button>
      </div>
      <div className="users-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.userId} className="user-card">
              {/* <img
                src={user.profileImageUrl || "default-avatar.png"}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-avatar"
              /> */}
              <div className="user-details">
                <h3 style={{ cursor: "pointer" }} onClick={() => UserDetails(user.email)}>
                  {`${user.firstName} ${user.lastName}`} </h3>
                <p>Email: {user.email}</p>
                <p>Contact: {user.contactNo}</p>
                <p>Gender: {user.gender}</p>
                <p>Role: {user.role}</p>
              </div>
              <button
                onClick={() => handleConnect(user.userId)}
                className="connect-button"
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default InvestorsExplore;
