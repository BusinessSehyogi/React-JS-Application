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
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";



const PostCard = ({ post, userId, firstName, lastName, abstractContent }) => {

  const navigate = useNavigate();
  const { error, isLoading, Razorpay } = useRazorpay();

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
    const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response;

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
      const response = await fetch(url,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data !== undefined) {
        setLikesCount(data);


      } else {
        console.error("API did not return likes count");
      }
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  useEffect(() => {
    fetchLikesCount();
  }, []);

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

  const toggleComments = (Id) => {
    if(post.postId==Id){
      setCommentsVisible(!commentsVisible);
    }
   
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let userId = Number(sessionStorage.getItem("Token"));
        let url = `http://${globalVariable.value}/getPostForHomePage/${userId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFounderData({ businessIdeas: data }); // Store the fetched data
      } catch (error) {
        console.error("Error fetching founder data:", error);
        setFounderData([]);
      }
    };

    fetchUser();
  }, []);

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

          // // Ensure data.comments is an array
          // const commentsArray = Array.isArray(data[0].comment)
          //   ? data[0].comment
          //   : [data[0].comment].filter(Boolean);

          setComments(data);
          // localStorage.setItem(comments-${post.postId}, JSON.stringify(commentsArray[0]));
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
        // localStorage.setItem(
        //   `comments-${post.postId}`,
        //   JSON.stringify(comments)
        // );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error while deleting comment:", error);
    }
  };
  

  const handlePayment = async () => {
    try {
      const paymentPayload = {
        amount: 150 * 100, // Convert amount to paise (1 INR = 100 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
  
      // Step 1: Create a Razorpay order
      const response = await fetch(
        `http://${globalVariable.value}/createRazorpayOrder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        }
      );
  
      const orderData = await response.json();
  
      // Step 2: Initialize Razorpay payment
      const options = {
        key: "rzp_test_l1ICZHjDTy4OQL", // Replace with your Razorpay test key
        amount: 5000, // Amount in paise
        currency: "INR",
        name: "Just testing",
        description: "Test Transaction",
        order_id: orderData.id, // Order ID returned by Razorpay
        handler: async function (response) {
          // Payment successful, send data to the /addPayment API
          const paymentDetails = {
            amount: orderData.amount / 100, // Convert back to INR
            paymentDateTime: new Date().toISOString(),
            transactionId: response.razorpay_payment_id,
            users: userId, // Replace with logged-in user's ID
            posts: post.postId, // Replace with the current post's ID
          };
  
          try {
            // Step 3: Send payment details to the backend
            const paymentResponse = await fetch(
              `http://${globalVariable.value}/addPayment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentDetails),
              }
            );
  
            if (paymentResponse.ok) {
              const result = await paymentResponse.json();
              setIsPurchased(true); // Mark the post as purchased
              localStorage.setItem(`purchased-${post.postId}`, "true");
            } else {
              console.error("Failed to log payment:", paymentResponse.statusText);
            }
          } catch (error) {
            console.error("Error sending payment details to backend:", error);
          }
        },
        prefill: {
          name: "Your Name", // Replace with user's name
          email: "email@example.com", // Replace with user's email
          contact: "9999999999", // Replace with user's contact
        },
        theme: {
          color: "#F37254",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error.description);
      });
    } catch (error) {
      console.error("Error during Razorpay payment:", error);
    }
  };
  



  let postIdDetails = "";

  const handlePost = (postId) => {
    setpostIdDetails(postId);

    setIspostDetails(true);

    navigate(`/founders/PostFullDetails`, { state: { postIdDetails: postId } });
  };

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
          onClick={getLikes}
          // onhandled={handleLikeToggle}
        >
          <FaHeart
            style={{
              color: isLiked ? "red" : "grey",
              transition: "color 0.3s ease",
              border: isLiked ? "2px  red" : "2px  black",
            }}
          />
          {likesCount}
        </button>

        <button className="comment-button" onClick={()=>toggleComments(post.postId)}>
          <FaComment />
        </button>


        {/* Payment Button */}
        <button
          className="payment-button"
          onClick={() => {
            if (isPurchased) {
              navigate("/founder/PostFullDetails", { state: { postId: post.postId } });
            } else {
              handlePayment();
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
                    {comment?.comment || "Ni"}
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