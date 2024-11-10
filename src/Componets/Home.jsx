import React, { useEffect, useState } from "react";
import logo from "../Images/logo-no-background name.png";
import { useNavigate } from "react-router-dom";
import homepagepic from "../Images/businessperson-meeting-clip-art-transprent-png-team-work-11562903613sqceweh3yc.png";
import Signup from "./Signup"; // Import the Signup component
import "./home.css";
import Login from "./Login";
import Boat from "../Images/Boat_Logo.webp.png";
import cars24 from "../Images/cars24.png";
import udaan from "../Images/udaan.png";
import whitehat from "../Images/WhiteHat_Jr.webp.png";
import blackrock from "../Images/blackrock.jpg";
import Goldman from "../Images/Goldman_Sachs.svg.png";
import Morgan from "../Images/Morgan S.jpg";
import vangard from "../Images/Vanguard.png";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false); // State to control the signup modal
  const [isLogin, setIsLogin] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Name");
    window.location.reload();
  };

  const onLogin = () => {
    // navigate('/login');
    setIsSignupOpen(false); // Close the signup modal
    setIsLogin(false);
    setIsLogin(true);
  };

  const onRegister = () => {
    setIsSignupOpen(false); // Close the signup modal
    setIsLogin(false);
    setIsSignupOpen(true); // Open the signup modal
  };

  const closeModal = () => {
    setIsSignupOpen(false); // Close the signup modal
    setIsLogin(false);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("Token"); // Change localStorage to sessionStorage
    if (token) {
      navigate("/FounderDashboard"); // Redirect to home if token exists
    }
  }, [navigate]);

  return (
    <div className="home-home">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="nav-links">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/about")}>About</span>
          <span onClick={() => navigate("/founder")}>Founder</span>
          <span onClick={() => navigate("/investors")}>Investor</span>
          <span onClick={() => navigate("/reviews")}>Review</span>
        </nav>
        <div className="auth-buttons">
          {username ? (
            <>
              <span className="greeting">Hello ${username}</span>
              <button className="button logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="button" onClick={onLogin}>
                Login
              </button>
              <button className="button" onClick={onRegister}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="content">
          <div className="text-box">
            <h1>Connecting Businesses, Creating Opportunities</h1>
            <p>
              At Business Sehyogi, we empower small businesses by connecting
              them with investors who share their vision. Together, we can build
              a brighter future for entrepreneurship.
            </p>
            <button className="button get-started">Get Started</button>
          </div>
          <div className="image-box">
            <img src={homepagepic} alt="Business Meeting" />
          </div>
        </div>
        <section className="features">
          <h2>Our Features</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Connect</h3>
              <p>
                Link businesses with potential investors through our platform.
              </p>
            </div>
            <div className="feature-item">
              <h3>Invest</h3>
              <p>Explore diverse investment opportunities tailored for you.</p>
            </div>
            <div className="feature-item">
              <h3>Grow</h3>
              <p>
                Receive expert guidance and support for your business journey.
              </p>
            </div>
          </div>
        </section>

        <div class="container">
          <h2>Founder</h2>

          <div class="logo-founder">
            <img src={Boat} alt="Company Logo" />
            <img src={cars24} alt="Company Logo" />
            <img src={udaan} alt="Company Logo" />
            <img src={whitehat} alt="Company Logo" />
          </div>

          <div class="founder-details">
            <p>Boat</p>
            <p>Cars24</p>
            <p>Udaan</p>
            <p>whitehat</p>
          </div>
        </div>

        <div class="container">
          <h2>Investor</h2>

          <div class="logo-founder">
            <img src={blackrock} alt="Company Logo" />
            <img src={Goldman} alt="Company Logo" />
            <img src={Morgan} alt="Company Logo" />
            <img src={vangard} alt="Company Logo" />
          </div>

          <div class="Investor-details">
            <p>BlackRock</p>
            <p>Golden Sachs</p>
            <p>Morgan Stanley</p>
            <p>Vanguard</p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Business Sehyogi. All rights reserved.</p>
      </footer>

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              X
            </button>
            <Signup closeModal={closeModal} />
          </div>
        </div>
      )}
      {isLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              X
            </button>
            <Login closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
