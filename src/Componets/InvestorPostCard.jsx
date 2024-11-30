import React, { useState, useEffect } from "react";
import "./investorPostCard.css";
import {
  FaHeart,
  FaComment,
  FaTrash,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { globalVariable } from "./globalVariables";
import { useNavigate } from "react-router-dom";

const InvestorPostCard = ({ post, userId, firstName, lastName, abstractContent,likesCount }) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isInterested, setIsInterested] = useState(false);


//   useEffect(() => {
//     const initializePostData = async () => {
//       try {
//         const postId = post.postId;

        // Fetch likes count and check if the user liked the post
        // const likesUrl = `http://${globalVariable.value}/getTotalLikesOfPost/${postId}`;
        // const likesResponse = await fetch(likesUrl);
        // const likesData = await likesResponse.json();
        // setLikesCount(likesData.likes || 0);
        // setIsLiked(likesData.userLiked || false); // Assume backend sends `userLiked` flag

        // Fetch interest state
        // const interestUrl = `http://${globalVariable.value}/getInterestedPosts?investorId=${userId}`;
        // const interestResponse = await fetch(interestUrl);
        // const interestedPosts = await interestResponse.json();

        // Check if the current post is marked as "interested"
        // if (interestedPosts.some((interestedPost) => interestedPost.postId === postId)) {
//           setIsInterested(true);
//         }
//       } catch (error) {
//         console.error("Error initializing post data:", error);
//       }
//     };

//     initializePostData();
//   }, [post.postId, userId]);



  useEffect(() => {
    const initializeLikes = async () => {
      try {
        const postId = post.postId;
        const url = `http://${globalVariable.value}/getTotalLikesOfPost/${postId}`;
        const response = await fetch(url);
        const data = await response.json();
        // setLikesCount(data.likes || 0);

        const likedState = localStorage.getItem(`liked-${post.postId}`);
        if (likedState === "true") setIsLiked(true);
      } catch (error) {
        console.error("Error initializing likes:", error);
      }
    };

    initializeLikes();
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
        // setIsLiked((prev) => !prev);
        // setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        // localStorage.setItem(`liked-${post.postId}`, !isLiked);
        const updatedLikes = await response; // Assume backend sends updated likes and state
        setIsLiked(!isLiked);
        // setLikesCount(updatedLikes.likes);
      } else {
        console.error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  useEffect(() => {
    const fetchComments = async () => {
      const postId = post.postId;
      const url = `http://${globalVariable.value}/getCommentForPost/${postId}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.postId]);

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const postId = post.postId;
      const url = `http://${globalVariable.value}/addComment/${postId}/${userId}?comment=${encodeURIComponent(
        newComment
      )}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const addedComment = await response.json();
        setComments((prev) => [...prev, addedComment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    const url = `http://${globalVariable.value}/deleteComment/${commentId}`;
    try {
      const response = await fetch(url, { method: "DELETE" });
      if (response.ok) {
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

  const handleInterested = async () => {
    const postId = post.postId;
    const url = `http://${globalVariable.value}/addInterestedPost?investorId=${userId}&postId=${postId}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        // setIsInterested((prev) => !prev);
        const updatedInterest = await response; // Assume backend sends updated state
        setIsInterested(!isInterested);
      } else {
        console.error("Failed to toggle interest");
      }
    } catch (error) {
      console.error("Error while toggling interest:", error);
    }
  };

  const handlePostDetails = () => {
    navigate(`/investor/InvestorPostFullDetails`, { state: { postId: post.postId } });
  };

  return (
    <div className="post-card">
      <p>
        {firstName} {lastName}
      </p>
      <p>{post.abstractContent}</p>
      <div className="post-actions">
        <button className="like-button" onClick={handleLikeToggle}>
          <FaHeart
            style={{
              color: isLiked ? "red" : "grey",
              transition: "color 0.3s ease",
            }}
          />
         
        </button>
        <span className="likes-count">{likesCount}</span>

        <button className="comment-button" onClick={toggleComments}>
          <FaComment />
        </button>

       

      
        <button
          className="interest-button"
          onClick={handleInterested}
          style={{
            backgroundColor: "white",
            color: isInterested ? "green" : "grey",
          }}
        >
          {isInterested ? <FaThumbsUp /> : <FaThumbsUp />}
        </button>

        <button className="details-button" onClick={handlePostDetails}>
          Full Details
        </button>
      </div>

      {commentsVisible && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <p>
                    <strong>{comment?.user?.firstName || "User"}:</strong>{" "}
                    {comment.comment}
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
    </div>
  );
};

export default InvestorPostCard;
