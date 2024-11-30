import React, { useState,useEffect } from "react";
import AdminHeader from "./AdminHeader";
import "./AdminDashboard.css"
import { globalVariable } from "./globalVariables";

function AdminDashboard() {
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
    <div>
      <AdminHeader/>
      <div className="users-list">
  {filteredUsers.length > 0 ? (
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
        
          <th>Gender</th>
          <th>Role</th>
          <th>Photo</th>
          {/* <th>Password</th> */}
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr key={user.userId}>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{user.contactNo}</td>
          
            <td>{user.gender}</td>
            <td>{user.category}</td>
            <td>{user.photo}</td>
            {/* <td>{user.password}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No users found.</p>
  )}
</div>
    </div>
  );
}

export default AdminDashboard;