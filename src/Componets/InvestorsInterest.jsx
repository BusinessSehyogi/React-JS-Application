import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FounderDashboard.css";
import { globalVariable } from "./globalVariables";
import InvestorHeader from "./InvestorHeader";
import "./profileupdate.css";
import "react-toastify/dist/ReactToastify.css";
import InvestorPostCard from "./InvestorPostCard";
import "./FounderPostHome.css";

function InvestorsInterest() {
  const navigate = useNavigate();
  const [founderData, setFounderData] = useState({ businessIdeas: [] });
  const [interestedPosts, setInterestedPosts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  const userId = sessionStorage.getItem("Token");
  const investorId = sessionStorage.getItem("investorToken");

  useEffect(() => {
    // Redirect if no user token
    if (!userId) {
      navigate("/investor/InvestorDashboard");
    }
  }, [navigate, userId]);

  // Fetch Interested Posts
  useEffect(() => {
    const fetchInvestorDetails = async () => {
      const url = `http://${globalVariable.value}/getAllInterestedPostsOfInvestor/${investorId}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const posts = data.map((item) => item.post);
          setInterestedPosts(posts || []);
        } else {
          console.error("Failed to fetch investor details");
        }
      } catch (error) {
        console.error("Error fetching investor details:", error);
      }
    };

    if (investorId) {
      fetchInvestorDetails();
    }
  }, [investorId]);

  // Fetch Business Ideas for the Founder
  const fetchUser = async (currentPage) => {
    try {
      const url = `http://${globalVariable.value}/getPostForHomePage/${userId}?page=${currentPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Append new data to the current list
      if (data.length === 0) {
        setHasMoreData(false);
      } else {
        setFounderData((prevData) => ({
          businessIdeas: [...prevData.businessIdeas, ...data],
        }));
      }
    } catch (error) {
      console.error("Error fetching founder data:", error);
    }
  };

  // Load more business ideas
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchUser(page);
  }, [page]);

  return (
    <div className="dashboard-container">
      <InvestorHeader />

      {/* Interested Posts Section */}
      <div className="interested-posts-container">
        <h2>Interested Posts</h2>
        {interestedPosts.length > 0 ? (
          interestedPosts.map((post) => (
            <InvestorPostCard
              key={post.postId}
              post={post}
              userId={userId}
              likesCount={post.noOfLikes || 0}
              firstName={post.user?.firstName || "Unknown User"}
              lastName={post.user?.lastName || ""}
              abstractContent={
                post.abstractContent || "No abstract content available"
              }
            />
          ))
        ) : (
          <p>No interested posts found.</p>
        )}
      </div>

      {/* Business Ideas Section */}
      {/* <div className="row Founder-Post-create">
        <div className="post-cards-container">
          {founderData.businessIdeas.length > 0 ? (
            founderData.businessIdeas.map((item) => (
              <InvestorPostCard
                key={item.postId}
                post={item}
                userId={userId}
                likesCount={item.noOfLikes}
                firstName={item.user?.firstName || "Unknown user"}
                lastName={item.user?.lastName || "Unknown user"}
                abstractContent={
                  item.abstractContent || "No abstract content available"
                }
              />
            ))
          ) : (
            <p>No business ideas available.</p>
          )}
        </div> */}

        {/* Load More Button */}
        {/* {hasMoreData && (
          <div className="Create-Post-home">
            <button onClick={loadMore}>Load more</button>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default InvestorsInterest;
