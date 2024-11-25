import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FounderDashboard.css";
import { globalVariable } from "./globalVariables";
import Header from "./Header";
import "./profileupdate.css";
import "react-toastify/dist/ReactToastify.css";
import PostCard from "./PostCard";
import "./FounderPostHome.css";

const FounderPostHome = () => {
  const navigate = useNavigate();
  const [founderData, setFounderData] = useState({ businessIdeas: [] });
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(0); // State for page number
  const [hasMoreData, setHasMoreData] = useState(true); // State to track if there's more data
  let userId = sessionStorage.getItem("Token");
  let email = sessionStorage.getItem("Email");
  let data;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    photo: "",
  });

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

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const fetchUser = async (currentPage) => {
    try {
      console.log("userId",userId);
      
      let url = `http://${globalVariable.value}/getPostForHomePage/${userId}?page=${currentPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Check if more data is available
      if (data.length === 0) {
        setHasMoreData(false); // No more data
      } else {
        setFounderData((prevData) => ({
          businessIdeas: [...prevData.businessIdeas, ...data],
        }));
      }
    } catch (error) {
      console.error("Error fetching founder data:", error);
    }
  };

  useEffect(() => {
    fetchUser(page);
  }, [page]);

  const LoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page number
  };

  const ClickChange = () => {
    navigate("/CreatePost");
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="row Founder-Post-create">
        <div className="Create-Post-home">
          <button onClick={ClickChange}>Create New Post</button>
        </div>

        <div className="post-cards-container">
          {founderData.businessIdeas && founderData.businessIdeas.length > 0 ? (
            founderData.businessIdeas.map((item) => (
              <PostCard
                key={item.postId}
                post={item}
                userId={userId}
                firstName={item.user?.firstName || "Unknown user"}
                lastName={item.user?.lastName || "Unknown user"}
                abstractContent={
                  item.user?.abstractContent || "No abstract content"
                }
              />
            ))
          ) : (
            <p>No business ideas available</p>
          )}
        </div>

        {hasMoreData && (
          <div className="Create-Post-home">
            <button onClick={LoadMore}>Load more</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderPostHome