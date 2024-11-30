import React, { useState, useEffect } from "react";
import "./PostFullDetails.css"; // Create this CSS for styling
import InvestorHeader from "./InvestorHeader";
import { FaLightbulb, FaHeart, FaComment,FaTrash,FaMoneyBillWave,FaStar } from "react-icons/fa";
import { globalVariable } from "./globalVariables";
// import { useLocation } from 'react-router-dom';


function InvestorPostFullDetails () {
   

    const [postsData, setPostsData] = useState({ businessIdeas: [] });
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [founderData, setFounderData] = useState([]); 
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [newComment, setNewComment] = useState(""); 
    const [comments, setComments] = useState([]);
    const [isPurchased, setIsPurchased] = useState(false); // Track if the post is purchased
    const [paymentPopup, setPaymentPopup] = useState(false); 
    const [paymentResponse, setPaymentResponse] = useState(null);

    let userId = Number(sessionStorage.getItem("Token"));

    const [error, setError] = useState(null);

   
  const postId = 1;

    // const location = useLocation();
    // const { postIdDetails } = location.state || {};

    // useEffect(() => {
    //     const savedLikeState = localStorage.getItem(`liked-${post.postId}`);
    //     if (savedLikeState === "true") {
    //       setIsLiked(true);
    //     }
    //   }, [post.postId]);
    
    //   useEffect(() => {
    //     const savedPurchaseState = localStorage.getItem(`purchased-${post.postId}`);
    //     if (savedPurchaseState === "true") {
    //       setIsPurchased(true);
    //     }
    //   }, [post.postId])

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            let userId = Number(sessionStorage.getItem("Token"));
            let url = `http://${globalVariable.value}/getPostById/${postId}`;
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setPostsData({businessIdeas:[data]}); // Ensure it's an array
            setLoading(false);
          } catch (error) {
            console.error("Error fetching posts:", error);
            setPostsData([]);
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, [postId]);

      
      
      if (loading) {
        return <p>Loading...</p>;
      }
    
      if (error) {
        return <p>Error: {error}</p>;
      }


    //   const getLikes = async () => {
   
    //     let postId = post.postId
    //     const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    //     const response = await fetch(url, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" }
    //     });
    //     let data = await response;
    
    //     const newLikeState = !isLiked;
    //     setIsLiked(newLikeState);
    
    //     // Save the new state to localStorage
    //     localStorage.setItem(`liked-${post.postId}`, newLikeState);
    //   };
    
    
    //   const toggleComments = () => {
    //     setCommentsVisible(!commentsVisible);
    //   };


    //   const submitComment = async () => {
    //     if (!newComment.trim()) return; // Prevent empty comments
      
    //     try {
    //       const postId = post.postId;
    //       const url = `http://${globalVariable.value}/addComment/${postId}/${userId}?comment=${encodeURIComponent(
    //         newComment
    //       )}`;
    //       const response = await fetch(url, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //       });
      
    //       if (response.ok) {
    //         // Update UI after successful comment submission
    //         const addedComment = await response.json();
    //         setComments((prev) => [...prev, addedComment]);
    //         setNewComment(""); // Clear input field
    //       } else {
    //         console.error("Failed to add comment");
    //       }
    //     } catch (error) {
    //       console.error("Error while adding comment:", error);
    //     }
    //   };
      
      // Fetch Existing Comments
    //   useEffect(() => {
    //     const fetchComments = async () => {
    //       const postId = post.postId;
    //       const url = `http://${globalVariable.value}/getCommentForPost/${postId}`;
    //       try {
    //         const response = await fetch(url);
    //         if (response.ok) {
    //           const data = await response.json();
    //           setComments(data.comments || []);
    //         } else {
    //           console.error("Failed to fetch comments");
    //         }
    //       } catch (error) {
    //         console.error("Error fetching comments:", error);
    //       }
    //     };
      
    //     if (commentsVisible) fetchComments();
    //   }, [commentsVisible, post.postId]);
      
      // Delete a Comment
      const deleteComment = async (commentId) => {
        const url = `http://${globalVariable.value}/deleteComment/${commentId}`;
        try {
          const response = await fetch(url, {
            method: "DELETE",
          });
          if (response.ok) {
            // Update UI after successful comment deletion
            setComments((prev) => prev.filter((comment) => comment.commentId !== commentId));
          } else {
            console.error("Failed to delete comment");
          }
        } catch (error) {
          console.error("Error while deleting comment:", error);
        }
      };
      
    
   
  return (
    <div>
        <InvestorHeader/>
       
      {postsData.businessIdeas && postsData.businessIdeas.length > 0 ? (
        
            postsData.businessIdeas.map((post, index) => (
               <>
            <></>?
              <>
              <div key={index} className="post-card-two"> 
                <h3>{post.title}</h3>
                <p>{post.user.firstName}{post.user.lastName}</p>
                <p>{post.abstractContent}</p>
                <p>{post.content}</p>
                
                {post.images && post.images.length > 0 && (
                  <div className="image-gallery">
                    {post.images.map((image, imgIndex) => (
                      <img key={imgIndex} src={image} alt={`Post image ${imgIndex}`} />
                    ))}
                  </div>
                )}

<div className="post-actions">
        <button className="like-button" 
        // onClick={getLikes}
        >
          
            <FaHeart 
                 style={{
                  color: isLiked ? "red" : "grey",
                  transition: "color 0.3s ease",
                  border: isLiked ? "2px  red" : "2px  black", 
    // borderRadius: "50%", 
    // padding: "5px", 
                }}
            /> 
        </button>

        <button className="comment-button " 
        // onClick={toggleComments}
        >
          <FaComment /> 
        </button>

        {/* Payment Button */}
        
      </div>
               
              </div>
              
              </>:<></>
               </>
              
              
             )) 
           ) : (
            <p>No business ideas available</p>
          )}
         
          

        
          
          
          
      
     
      {commentsVisible && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <p>
                    <strong> {comment.user.firstName}:</strong> {comment.comment}
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
              onChange={(e) => setNewComment(e.target.value)

              }
            />
            {/* <button onClick={submitComment}>Post</button> */}
          </div>
        </div>
      )}
    
    
    </div>
  )
}

export default InvestorPostFullDetails;