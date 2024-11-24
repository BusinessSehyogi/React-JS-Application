import React, { useState, useEffect } from "react";
import "./PostCard.css";
import {
  FaLightbulb,
  FaHeart,
  FaComment,
  FaTrash,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import { globalVariable } from "./globalVariables";
import { useNavigate } from "react-router-dom";
import PostFullDetails from "./PostFullDetails";

const PostCard = ({ post, userId, firstName, lastName, abstractContent }) => {
  // console.log("PostUser",postUser)

  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [founderData, setFounderData] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false); // Track if the post is purchased
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [IspostDetails, setIspostDetails] = useState(false);
  const [postIddetials, setpostIdDetails] = useState("");

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
    const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    const response = await fetch(url, {
      method: "POST",
    });
    let data = await response;

    const newLikeState = !isLiked;
    setIsLiked(newLikeState);

    // Save the new state to localStorage
    localStorage.setItem(`liked-${post.postId}`, newLikeState);
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let userId = Number(sessionStorage.getItem("Token"));
        let url = `http://${globalVariable.value}/getPostForHomePage/${userId}?page=0`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFounderData({ businessIdeas: data }); // Store the fetched data
        // console.log(data,"--Dashboard data user")
      } catch (error) {
        console.error("Error fetching founder data:", error);
        setFounderData([]);
      }
    };

    fetchUser();
  }, []);

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
        setComments((prev) => [...prev, addedComment]);
        setNewComment(""); // Clear input field
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
    }
  };

  // Fetch Existing Comments
  useEffect(() => {
    const fetchComments = async () => {
      const postId = post.postId;
      const url = `http://${globalVariable.value}/getCommentForPost/${postId}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (commentsVisible) fetchComments();
  }, [commentsVisible, post.postId]);

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
      } else {
        console.error("Payment failed:", paymentResult);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handlePost = (postId) => {
    // console.log("postcheckingid",postIdDetails)
    setpostIdDetails(postId);

    setIspostDetails(true);
    // console.log("hi")

    navigate(`/PostFullDetails`, { state: { postIdDetails: postId } });
  };
  // console.log("postiddetailsin post",postIddetials)

  return (
    <div className="post-card">
      <p>
        {firstName} {lastName}
      </p>
      <p>{post.abstractContent}</p>

      <div className="post-actions">
        <button className="like-button" onClick={getLikes}>
          <FaHeart
            style={{
              color: isLiked ? "red" : "grey",
              transition: "color 0.3s ease",
              border: isLiked ? "2px  red" : "2px  black",
            }}
          />
        </button>

        <button className="comment-button " onClick={toggleComments}>
          <FaComment />
        </button>
        <button
          className="payment-button"
          onClick={() => {
            if (isPurchased) {
              handlePost(post.postId);
            } else {
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
              comments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <p>
                    <strong> {comment.user.firstName}:</strong>{" "}
                    {comment.comment}
                  </p>
                  <button
                    className="delete-button"
                    onClick={() => deleteComment(comment.commentId)}
                  >
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
