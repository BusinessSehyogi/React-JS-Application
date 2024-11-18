import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FounderDashboard.css";
import logo from "../Images/logo-no-background name.png";
import { globalVariable } from "./globalVariables";
import {
  FaBars,
  FaHome,
  FaLightbulb,
  FaEnvelope,
  FaBell,
  FaUser,
  FaPlus,
  FaCheckCircle,

} from "react-icons/fa";
import Header from "./Header";
import EditProfileModal from "./EditProfileModal";
import "./profileupdate.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from "firebase/app";
import * as storageFunctions from "firebase/storage";
import PostCard from "./PostCard";
import "./FounderPostHome.css"



const firebaseConfig = {
  apiKey: "AIzaSyAbZHN7lAKXQNV4aQcGl9W6sSjpPCgKVT0",
  authDomain: "business-sehyogi.firebaseapp.com",
  projectId: "business-sehyogi",
  storageBucket: "business-sehyogi.appspot.com",
  messagingSenderId: "780888034585",
  appId: "1:780888034585:web:8b44f036a8c66570df4988",
  measurementId: "G-ZBK29X70KK",
};
const app = initializeApp(firebaseConfig);
const storage = storageFunctions.getStorage(app);

const FounderPostHome = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [founderData, setFounderData] = useState({ businessIdeas: [] }); // Initialize with businessIdeas
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  let userId = Number(sessionStorage.getItem("Token"));
  let email = sessionStorage.getItem("Email");
  let data;



  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    photo: ""
  });

  const [otpForEmail, setOtpForEmail] = useState("");
  const [otpForPhone, setOtpForPhone] = useState("");
  const [otpVerificationEmail, setOtpVerificationEmail] = useState(false);
  const [otpVerificationPhone, setOtpVerificationPhone] = useState(false)



  const handleSubmit = async (event) => {
    console.log(formData.gender);

    event.preventDefault();
    try {
      let url = `http://${globalVariable.value}/updateUser/${userId}`;
      let response = await fetch(url, {
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
          gender: formData.gender,
          contactNo: formData.contactNo,
          category: "Investor",
          photo: null,
          visible: false,
          emailVerified: false,
          contactNoVerified: false,
          dateTimeOfRegistration: null,
          dateOfBirth: null,
        }),
      });

      if (response.ok) {
        toast("Your profile has been updated");
        setIsEditable(false); // Exit edit mode after submitting

      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://${globalVariable.value}/getPostsForFounder/${userId}`;
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFounderData({ businessIdeas: data }); // Store the fetched data

      } catch (error) {
        console.error("Error fetching founder data:", error);
      }

      try {
        let url = `http://${globalVariable.value}/getUser/${email}`;
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching founder data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://${globalVariable.value}/getUser/${email}`;
        let response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          contactNo: data.contactNo || "",
          gender: data.gender || "",
        });
        setImagePreview(data.profileImageUrl || null);
        sessionStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("userProfile");
    if (storedProfile) {
      const userData = JSON.parse(storedProfile);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        contactNo: userData.contactNo || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
        photo: userData.profileImageUrl || "",
      });
      setImagePreview(userData.profileImageUrl || null);
    }
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      // const updatedProfile = { ...JSON.parse(sessionStorage.getItem("userProfile")), profileImageUrl: file };
      // sessionStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }
    let imageName = userId + ".jpg";
    console.log("imageName ", imageName);


    await uploadImageToFirebase();

    let url = `http://${globalVariable.value}/updateUserPhoto/${userId}`;
    let response = await fetch(url, {
      method: "POST",
      body: imageName,
    });
  };



  const uploadImageToFirebase = async () => {
    if (!profileImage) return;

    try {
      const storageRef = storageFunctions.ref(storage, `userProfileImages/${userId}.jpg`);
      await storageFunctions.uploadBytes(storageRef, profileImage);
      const downloadURL = await storageFunctions.getDownloadURL(storageRef);

      toast("Image uploaded successfully!");
      setFormData((prevData) => ({ ...prevData, photo: downloadURL }));
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.value; // Capture the search term
    console.log("Search term:", searchTerm);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Email");
    navigate("/");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleProfileClick = () => {
    navigate("/ProfileUpdate");
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
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
    const updatedProfile = { ...JSON.parse(sessionStorage.getItem("userProfile")), [id]: value };
    sessionStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const notify = () => toast("Your profile has been updated");

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev); // Toggle edit mode
  };


  const handleSubmited = async (event) => {
    event.preventDefault();
    try {
      if (otpVerificationEmail && otpVerificationPhone) {
        // Proceed with form submission if both OTPs are verified
        const url = `http://${globalVariable.value}/updateUser/${userId}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast("Your profile has been updated");
          setIsEditable(false); // Exit edit mode
        }
      } else {
        toast("Please verify both email and phone number with OTP.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  let OTPData;
  const requestMailOtp = async (type) => {
    // Placeholder logic to request OTP for either email or phone
    const url = `http://${globalVariable.value}/sendMail/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    OTPData = await response.json();
    console.log(data);

    if (response.ok) {
      toast(`OTP sent to your ${type}`);
    }
  };

  const requestSMSOtp = async (type) => {
    // Placeholder logic to request OTP for either email or phone
    const url = `http://${globalVariable.value}/sendSMS/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    let data = await response.json();
    console.log(data);

    if (response.ok) {
      toast(`OTP sent to your ${type}`);
    }
  };

  const verifyOtp = async (type, otp) => {
    // Placeholder logic to verify OTP
    // const url = `http://${globalVariable.value}/verifyOtp`;
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ userId, otp, type }),
    // });
    // if (response.ok) {
    //   toast(`${type.charAt(0).toUpperCase() + type.slice(1)} verified!`);
    //   type === "email" ? setOtpVerificationEmail(true) : setOtpVerificationPhone(true);
    // }

    if (OTPData == otpForEmail.value) {
      console.log("OTP is same...!");
      console.log(userId);
      const url = `http://${globalVariable.value}/verifyEmail/${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        toast(`${type.charAt(0).toUpperCase() + type.slice(1)} verified!`);
        type === "email" ? setOtpVerificationEmail(true) : setOtpVerificationPhone(true);
      }
    }

  };

  const toggleEditModed = () => {
    setIsEditable((prev) => !prev);
    setOtpVerificationEmail(false);
    setOtpVerificationPhone(false);
  };

  const ClickChange =() =>{
    navigate("/CreatePost")
  }

  return (
    <div className="dashboard-container">
      {/* <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {sidebarOpen ? (
          <>
            <div
              className="menu-item"
              onClick={() => navigate("/FounderPostHome")}
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
              <div
                className="menu-item"
                onClick={() => navigate("/FounderPostHome")}
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

      {/* {editProfileOpen && <EditProfileModal closeModal={handleCloseEditProfile} founderData={founderData} />} */}

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
        {/* ---------------------------------------------------Post card------------------------------------------------------------------------------ */}
       
       <div className="Create-Post-home">
        <button onClick={ClickChange}>Create New Post</button>

       </div>
       
       <div>
       <div className="post-cards-container">
  {founderData.businessIdeas.map((post, index) => (
    <PostCard key={index} post={post} />
  ))}
</div>

       </div>
       
       
      
    </div>
  );
};

export default FounderPostHome;
