import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { globalVariable } from "./globalVariables";
import "./Signup.css"; // Ensure this CSS file is created and linked
import InvestorSignupone from "./InvestorSignupone";
import InvestorSignuptwo from "./InvestorSignuptwo";
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

  const handleSuccess = (credentialResponse) => {
    console.log("Success", credentialResponse);
    const decode = jwtDecode(credentialResponse?.credential);
    console.log(decode);
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

    console.log(date);

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
      alert("Registration is successful");
      navigate("/");
    } else {
      alert("Already registered");
    }
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
          {selectedComponent === "investor" ? <InvestorSignupone /> : null}
          <hr></hr>
          <GoogleOAuthProvider clientId="422099475744-bld6nl3obcj7n6s5ct4i93ln52spcob7.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              text="continue_with"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}

export default Signup;
