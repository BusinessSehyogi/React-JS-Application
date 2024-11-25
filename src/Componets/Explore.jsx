import React, { useState,useEffect } from "react";
import Header from "./Header";
import "./Explore.css"; // Add styles for the search bar
import { globalVariable } from "./globalVariables";

function Explore() {
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
    console.log(`Connect button clicked for user ID: ${userId}`);
    // Add logic to handle connection (e.g., send a connection request)
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const url = `http://${globalVariable.value}/getUsers`; // Update endpoint
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const users = await response.json();
        console.log("Fetched Users:", users); // Log all users to console
  
        // Optionally, update state to display users in UI
        setFormData(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
  
    fetchAllUsers();
  }, []);

//   console.log("userdata->",formData);

  return (
    <div className="explore-container">
      <Header />
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
                <h3>{`${user.firstName} ${user.lastName}`}</h3>
                <p>Email: {user.email}</p>
                <p>Gender: {user.gender}</p>
                <p>Role: {user.category}</p>
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

export default Explore;
