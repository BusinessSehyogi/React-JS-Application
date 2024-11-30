import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { globalVariable } from "./globalVariables";
import "./adminLogin.css"; // Create a separate CSS file for admin login

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const ADMIN_EMAIL = "businesssehyogi@gmail.com";
  const ADMIN_PASSWORD = "businessSehyogi9876543210";

  const handleAdminLogin = (event) => {
    event.preventDefault();

    // Validate credentials
    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      sessionStorage.setItem("AdminToken", "admin-logged-in");
      alert("Login successful!");
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } else {
      alert("Invalid admin credentials. Please try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2 className="admin-login-title">Admin Login for business Sehyogi</h2>
        <form className="admin-login-form" onSubmit={handleAdminLogin}>
          <input
            className="admin-login-input"
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-container">
            <input
              className="admin-login-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <button className="admin-login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
