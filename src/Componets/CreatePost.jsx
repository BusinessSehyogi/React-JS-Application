import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./createPost.css";
import { IoMdAddCircle } from "react-icons/io";
import { globalVariable } from "./globalVariables";
import {
  FaBars,
  FaHome,
  FaLightbulb,
  FaEnvelope,
  FaBell,
  FaUser,
} from "react-icons/fa";
import logo from "../Images/logo-no-background name.png";
import Header from "./Header";
// import Navbar from './Navbar';

const CreatePost = ({ addNewPost }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [abstractContent, setAbstractContent] = useState("");
  const [fullContent, setFullContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [links, setLinks] = useState([""]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [founderData, setFounderData] = useState({ businessIdeas: [] });

  const [formData, setFormData] = useState([{
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    photo: "",
  }]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 3;

    if (files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setImages(files);
  

    // Generate image preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };
  console.log(images,"Imagesafter upload")

  // let url = `http://${globalVariable.value}/getArea`;
  // let response = fetch(url, {
  //   method: "get",
  // });

  // let area = "";
  // area = response.json();

  // console.log(area);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
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

      url = `http://${globalVariable.value}/addPost`;
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateAndTime: date,
          title: title,
          abstractContent: abstractContent,
          content: fullContent,
          noOfLikes: 0,
          noOfInterested: 0,
          visible: true,
          views: 0,
          boostedPost: false,
          userId: sessionStorage.getItem("Token"),
          areaId: 1,
        }),
      });
      console.log(images, "Images in submit")
      let postimage=[]
      images.forEach((image, index) => (
         postimage= {image:`image_${index}`}
        
      ))
      console.log("Postimage--",postimage)
      setFormData({
        photo:postimage
       })
        console.log(formData,"formData")
      let responseText = await response.json();

      console.log(responseText.postId);
      

      // {
      //   "linkId": 1,
      //   "link": "https://youtu.be/d33a1pK4OYs?feature=shared"
      // },

      links.forEach(async (link, index) => {
        url = `http://${globalVariable.value}/addLink`;
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "linkId": 0,
            "link": link,
            "post": {
              "postId": responseText.postId // Pass the post object with its ID
            }
          }),
        });
    });
    
      navigate("/FounderDashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.value; // Capture the search term
    // Add your search logic here, such as filtering data or making an API request
    console.log("Search term:", searchTerm);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Name");
    navigate("/");
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

  const handleAddLink = () => {
    setLinks([...links, ""]); // Add an empty string to the links array
  };

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("Token"); // Change localStorage to sessionStorage
    if (!token) {
      navigate("/"); // Redirect to home if token exists
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar and other content */}

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {sidebarOpen ? (
          <>
            <div
              className="menu-item"
              onClick={() => navigate("/FounderHomepage")}
            >
              <FaHome /> <span>Home</span>
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/FounderDashboard")}
            >
              <FaLightbulb /> <span>My Ideas</span>
            </div>
            <div className="menu-item" onClick={() => navigate("/messages")}>
              <FaEnvelope /> <span>Messages</span>
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/notifications")}
            >
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
              <div
                className="menu-item"
                onClick={() => navigate("/FounderHomepage")}
              >
                <FaHome />
              </div>
              <div
                className="menu-item"
                onClick={() => navigate("/FounderDashboard")}
              >
                <FaLightbulb />
              </div>
              <div className="menu-item" onClick={() => navigate("/messages")}>
                <FaEnvelope />
              </div>
              <div
                className="menu-item"
                onClick={() => navigate("/notifications")}
              >
                <FaBell />
              </div>
              <div className="menu-item" onClick={handleProfileClick}>
                <FaUser />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Info Section */}
      {/* {userInfoOpen && (
        <div className={`user-info ${userInfoOpen ? "open" : ""}`}>
          <img
            className="profile-image"
            src={founderData.profilePic}
            alt="User"
          />
          <h2>{founderData.name}</h2>
          <p>Followers: {founderData.followers}</p>
          <p>Following: {founderData.following}</p>
          <button>Edit button</button>
        </div>
      )} */}

      {/* Vertical line between sidebar and user info */}
      

      {/* Main Content Section */}
      <div className="main-content-founder-dashboard">
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
        {/* <Header/> */}

        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Move onSubmit to the form */}
          <label>Title:</label>
          <input
            type="text"
            value={title}
            className="title-create-post"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Abstract Content (150 words):</label>
          <textarea
            value={abstractContent}
            className="abstract-content-create-post"
            onChange={(e) => setAbstractContent(e.target.value)}
            maxLength="150"
            required
          />
          <label>Non-Abstract Content (500 words):</label>
          <textarea
            value={fullContent}
            className="content-create-post"
            onChange={(e) => setFullContent(e.target.value)}
            maxLength="500"
            required
          />
          <label>Upload Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="image-create-post"
            onChange={handleImageUpload}
          />
          <div className="image-previews">
            {imagePreviews.length > 0 &&
              imagePreviews.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
              ))}
          </div>
          <label>Upload Links:</label>
          {links.map((link, index) => (
            <div key={index} className="link-input-container">
              <input
                type="text"
                value={link}
                className="links-create-post"
                onChange={(e) => handleLinkChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="add-link-button"
              >
                <IoMdAddCircle />
              </button>
            </div>
          ))}
          <button type="submit" onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </form>
      </div>
      </div>
    
  );
};

export default CreatePost;
