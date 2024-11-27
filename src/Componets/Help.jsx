import React, { useState } from "react";
import Header from "./Header";
import "./help.css"; // Include styles for the Help page

function Help() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !question) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Query Submitted:", { email, question });
    alert("Your query has been submitted successfully!");
    
    // Clear the input fields
    setEmail("");
    setQuestion("");
  };

  return (
    <div>
      <Header />
      <div className="help-container">
        <h1>Need Help?</h1>
        <p>Please enter your email and your question below, and we'll get back to you as soon as possible.</p>
        <form className="help-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Your Question:</label>
            <textarea
              id="question"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            Submit Query
          </button>
        </form>
      </div>
    </div>
  );
}

export default Help;
