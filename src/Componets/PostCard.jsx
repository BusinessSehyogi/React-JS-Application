import React from "react";
import "./PostCard.css"; 
import { FaLightbulb, FaHeart, FaComment } from "react-icons/fa";
import { globalVariable } from "./globalVariables";

const PostCard = ({ post,userId }) => {

  const getLikes = async () => {
   
    let postId = post.postId
    console.log(postId,"PostId")
    const url = `http://${globalVariable.value}/addLike/${userId}/${postId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    let data = await response;
    console.log(data);
    

 
 
  };
  




  return (
    <div className="post-card">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-description">{post.description}</p>
      <div className="post-details">
        <span className="author-name">
          <FaLightbulb /> {post.authorName}
        </span>
        <span className="post-date">{post.date}</span>
      </div>
      <div className="post-actions">
        <button className="like-button" onClick={getLikes}>
          <FaHeart /> Like
        </button>
        <button className="comment-button">
          <FaComment /> Comment
        </button>
      </div>
    </div>
  );
};

export default PostCard;
