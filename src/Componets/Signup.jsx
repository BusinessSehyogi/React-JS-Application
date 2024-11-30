import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { globalVariable } from "./globalVariables";
import "./Signup.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FounderSignup from "./FounderSignup";
import { jwtDecode } from "jwt-decode";

function Signup({ onClose, closeModal }) {
  const [selectedComponent, setSelectedComponent] = useState("founder"); // Default to 'Founder'
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });

  const [investorFormData, setInvestorFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    investedCompanies: "",
    amountInvested: "",
  });

  const handleSuccess = (credentialResponse) => {
    const decode = jwtDecode(credentialResponse?.credential);
  };

  const handleError = () => {
    console.log("Error");
  };

  const [UserType, setUserType] = useState("Founder");

  const handleClick = async (event) => {
    event.preventDefault();

    //fetch date from server and pass in the body to add current date in database.
    let url = `http://${globalVariable.value}/getCurrentDateTime`;
    let response = await fetch(url, {
      method: "get",
    });

    let date = "";

    if (response.ok) {
      date = await response.text();
    } else {
      console.error("Error fetching data:", response.status);
    }

    url = `http://${globalVariable.value}/registerUser`;
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        category: UserType,
        visible: true,
        emailVerified: false,
        contactnoVerified: false,
        dateTimeOfRegistration: date,
      }),
    });

    if (response.status === 200) {
      toast("Registration is successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast("Already registered");
    }
  };

  const handleInvestorSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://${globalVariable.value}/registerInvestor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          
          user: {
            userId: 0,
            firstName: investorFormData.firstName,
            lastName: investorFormData.lastName,
            email:investorFormData.email,
            password: "securePassword123", 
            gender: "U", 
            contactNo: investorFormData.phone,
            noOfConnections: 1, 
            noOfIdeas: 1,
            category: "Investor", 
            photo: "default.jpg", 
            visible: "true", 
            emailVerified: "false",
            contactNoVerified: "false", 
            dateTimeOfRegistration: null, 
            dateOfBirth: null, 
          },
          investor: {
            totalInvestedAmount: investorFormData.amountInvested,
            topInvestedCompanies: investorFormData.investedCompanies,
            user_id: 0, 
          },
        }),
      });

      if (response.status === 200) {
        toast("Investor registration successful! Check mail for future updates");
        
        setTimeout(() => {
          closeModal();
          navigate("/");
        }, 10000)
         // Redirect to home

      } else {
        toast("Investor registration failed. User might already be registered.");
        setTimeout(() => {
          closeModal();
          navigate("/");
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting investor data:", error);
      toast("An error occurred during registration. Please try again.");
    }
  };

  const handleInvestorChange = (e) => {
    const { name, value } = e.target;
    setInvestorFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUserTypeSelection = (type) => {
    setSelectedComponent(type.toLowerCase());
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("Token"); // Change localStorage to sessionStorage
    if (token) {
      navigate("/FounderDashboard"); // Redirect to home if token exists
    }
  }, [navigate]);

  return (
    <div className="signup-page">
      <div className="signup-modal">
        <div className="modal-content-signup">
          <h4 className="Close-button-signup" onClick={closeModal}>
            X
          </h4>
          <h2 className="modal-title">Sign Up</h2>
          <div className="user-type-selection">
            <button
              className="button-signup"
              style={
                selectedComponent === "founder"
                  ? { backgroundColor: "blue", color: "white" }
                  : {}
              }
              onClick={() => handleUserTypeSelection("Founder")}
            >
              Founder
            </button>
            <button
              className="button-signup"
              style={
                selectedComponent === "investor"
                  ? { backgroundColor: "blue", color: "white" }
                  : {}
              }
              onClick={() => handleUserTypeSelection("Investor")}
            >
              Investor
            </button>
          </div>
          {selectedComponent === "founder" ? <FounderSignup /> : null}
          {selectedComponent === "investor" && (
            <div className="input-container-investor">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={investorFormData.firstName}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={investorFormData.lastName}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={investorFormData.email}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={investorFormData.phone}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <input
                type="text"
                name="investedCompanies"
                placeholder="Companies You Have Invested In"
                value={investorFormData.investedCompanies}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <input
                type="text"
                name="amountInvested"
                placeholder="Total Amount Invested"
                value={investorFormData.amountInvested}
                className="input-field"
                onChange={handleInvestorChange}
              />
              <button
                className="submit-button"
                onClick={handleInvestorSubmit}
              >
                Submit
              </button>
            </div>
          )}
          
          <hr></hr>
          <GoogleOAuthProvider clientId="422099475744-bld6nl3obcj7n6s5ct4i93ln52spcob7.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              text="continue_with"
            />
          </GoogleOAuthProvider>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Signup;