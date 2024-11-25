import React, { useState, useEffect } from "react";
import "./PostCard.css";
import {
  FaLightbulb,
  FaHeart,
  FaComment,
  FaTrash,
  FaMoneyBillWave,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { globalVariable } from "./globalVariables";
import { useNavigate } from "react-router-dom";
import PostFullDetails from "./PostFullDetails";

const PostCard = ({ post, userId, firstName, lastName, abstractContent }) => {
  // console.log("PostUser",postUser)

  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [founderData, setFounderData] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false); // Track if the post is purchased
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [IspostDetails, setIspostDetails] = useState(false);
  const [postIddetials, setpostIdDetails] = useState("");
  const [isInterested, setIsInterested] = useState(false); // New state for Interested

  useEffect(() => {
    const initializeLikes = async () => {
      try {
        const postId = post.postId;
        const url = `http://${globalVariable.value}/getTotalLikesOfPost/${postId}`;
        const response = await fetch(url);
        const data = await response.json();

        setLikesCount(data.likes || 0);

        // Check if the user already liked this post
        // const likedUrl = `http://${globalVariable.value}/isPostLikedByUser/${userId}/${postId}`;
        // const likedResponse = await fetch(likedUrl);
        // const likedData = await likedResponse.json();
        // setIsLiked(likedData.isLiked);
      } catch (error) {
        console.error("Error initializing likes:", error);
      }
    };

    initializeLikes();
  }, [post.postId, userId]);

  useEffect(() => {
    const savedLikeState = localStorage.getItem(`liked-${post.postId}`);
    if (savedLikeState === "true") {
      setIsLiked(true);
    }
  }, [post.postId]);

  useEffect(() => {
    const savedPurchaseState = localStorage.getItem(`purchased-${post.postId}`);
    if (savedPurchaseState === "true") {
      setIsPurchased(true);
    }
  }, [post.postId]);

  const getLikes = async () => {
    let postId = post.postId;
    // console.log(postId, "PostId");
    const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response;
    // console.log(data);

    const newLikeState = !isLiked;
    setIsLiked(newLikeState);

    // Save the new state to localStorage
    localStorage.setItem(`liked-${post.postId}`, newLikeState);
    await fetchLikesCount();
  };

  const fetchLikesCount = async () => {
    const postId = post.postId;
    try {
      const url = `http://${globalVariable.value}/getTotalLikesOfPost/${postId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data !== undefined) {
        setLikesCount(data);
        // console.log("data.like-", data.likes);
      } else {
        console.error("API did not return likes count");
      }
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  useEffect(() => {
    fetchLikesCount();
  }, [post.postId]);

  const handleLikeToggle = async () => {
    const postId = post.postId;
    const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        // throw new Error("Failed to toggle like");
      }
      // const newLikeState = !isLiked;
      // setIsLiked(newLikeState);
      // localStorage.setItem(`liked-${post.postId}`, newLikeState);
      else {
        console.error("Failed to toggle like");
      }
      // Update likes count
      // fetchLikesCount();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let userId = Number(sessionStorage.getItem("Token"));
        let url = `http://${globalVariable.value}/getPostsForHomePage/${userId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFounderData({ businessIdeas: data }); // Store the fetched data
        // console.log(data, "--Dashboard data user");
      } catch (error) {
        console.error("Error fetching founder data:", error);
        setFounderData([]);
      }
    };

    fetchUser();
  }, []);

  // console.log(founderData,"Founderdata")

  // console.log("filterdata",founderData.filter((item)=>(
  //   item.postId==post.postId
  // )))

  // console.log(Array.isArray(founderData));

  // console.log("First Name in PostCard:", firstName);
  // console.log("Post Object:", post);

  // console.log("currentPost",currentPostData)

  // Handle New Comment Submission
  const submitComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const postId = post.postId;
      const url = `http://${
        globalVariable.value
      }/addComment/${postId}/${userId}?comment=${encodeURIComponent(
        newComment
      )}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update UI after successful comment submission
        const addedComment = await response.json();
        const updatedComments = [...comments, addedComment];
        setComments(updatedComments);
        setNewComment(""); // Clear input field
        localStorage.setItem(
          `comments-${post.postId}`,
          JSON.stringify(updatedComments)
        );
        // console.log(setComments, "setNewComment");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
    }
  };

  useEffect(() => {
    const loadCommentsFromStorage = () => {
      const savedComments = localStorage.getItem(`comments-${post.postId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    };

    loadCommentsFromStorage();
  }, [post.postId]);

  // Fetch Existing Comments
  useEffect(() => {
    const fetchComments = async () => {
      const postId = post.postId;
      const url = `http://${globalVariable.value}/getCommentForPost/${postId}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log("Raw data:", JSON.stringify(data[0]["comment"]));

          // Ensure data.comments is an array
          const commentsArray = Array.isArray(data[0].comment)
            ? data[0].comment
            : [data[0].comment].filter(Boolean);

          setComments(commentsArray);
          // localStorage.setItem(comments-${post.postId}, JSON.stringify(commentsArray[0]));
          // console.log("Processed comments array:", commentsArray[0]);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.postId, globalVariable.value]);

  const loadCommentsFromStorage = () => {
    const savedComments = localStorage.getItem(`comments-${post.postId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  };

  // Delete a Comment
  const deleteComment = async (commentId) => {
    const url = `http://${globalVariable.value}/deleteComment/${commentId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        // Update UI after successful comment deletion
        setComments((prev) =>
          prev.filter((comment) => comment.commentId !== commentId)
        );
        localStorage.setItem(
          `comments-${post.postId}`,
          JSON.stringify(comments)
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error while deleting comment:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const dateTimeResponse = await fetch(
        `http://${globalVariable.value}/getCurrentDateTime`,
        {
          method: "GET",
        }
      );

      const currentDateTime = await dateTimeResponse.text();

      const paymentPayload = {
        amount: 150.5,
        paymentDateTime: currentDateTime,
        transactionId: `txn_${Date.now()}`,
        users: 11, // Direct integer value for users
        posts: 2, // Direct integer value for posts
      };

      const paymentResponse = await fetch(
        `http://${globalVariable.value}/addPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Updated header
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const paymentResult = await paymentResponse.text();

      if (paymentResponse.ok) {
        setIsPurchased(true);
        setPaymentPopup(false);

        localStorage.setItem(`purchased-${post.postId}`, "true");
        // navigate("/FounderDashboard")
        // console.log("Payment successful!", paymentResult);
      } else {
        console.error("Payment failed:", paymentResult);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  let postIdDetails = "";

  const handlePost = (postId) => {
    // console.log("postcheckingid", postIdDetails);
    setpostIdDetails(postId);

    setIspostDetails(true);
    // console.log("hi");

    navigate(`/PostFullDetails`, { state: { postIdDetails: postId } });
  };
  // console.log("postiddetailsin post", postIddetials);

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${post.postId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [post.postId]);

  const handleInterested = () => {
    setIsInterested((prev) => !prev);
  };

  const handleNotInterested = () => {};
  // const handleInterested = () => {
  //   setIsInterested((prevState) => !prevState); // Toggle the state
  // };

  // console.log("likesCount2-", likesCount);
  // Delete comment from server and update localStorage

  return (
    <div className="post-card">
      <p>
        {firstName} {lastName}
      </p>
      <p>{post.abstractContent}</p>
      <div className="post-actions">
        <button
          className="like-button"
          onClick={handleLikeToggle}
          // onhandled={handleLikeToggle}
        >
          <FaHeart
            style={{
              color: isLiked ? "red" : "grey",
              transition: "color 0.3s ease",
              border: isLiked ? "2px  red" : "2px  black",
            }}
          />
          {/* {console.log("likesCount", likesCount)} */}
          {likesCount}
        </button>

        <button className="comment-button" onClick={toggleComments}>
          <FaComment />
        </button>


        {/* Payment Button */}
        <button
          className="payment-button"
          onClick={() => {
            if (isPurchased) {
              // Navigate to full details page

              handlePost(post.postId);
            } else {
              // Open the payment popup
              setPaymentPopup(true);
            }
          }}
        >
          {isPurchased ? "Full Details" : "Pay"}
        </button>
        {isPurchased && <FaStar className="purchased-star" />}
      </div>
      {commentsVisible && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={comment.commentId || index} className="comment-item">
                  <p>
                    <strong>{comment?.user?.firstName || "Vivek"}:</strong>{" "}
                    {comment?.comment || "Nice Idea"}
                  </p>
                  <button onClick={() => deleteComment(comment.commentId)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={submitComment}>Post</button>
          </div>
        </div>
      )}

      {paymentPopup && (
        <div className="payment-popup">
          <p>Are you sure you want to buy this post?</p>
          <button onClick={handlePayment}>Confirm Payment</button>
          <button onClick={() => setPaymentPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
