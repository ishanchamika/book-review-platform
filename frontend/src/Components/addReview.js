import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Rating from "@mui/material/Rating";
import "../assets/addReview.css";

function AddReview() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const userEmail = token ? jwtDecode(token).email : null; // Get email from token

  //___________Handle form submission________________
  const handleAddReview = async (e) => 
  {
    e.preventDefault();

    if (!token) 
    {
      alert("You must log in to add a review.");
      navigate("/signin");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const newReview = {
      title: bookTitle,
      author: bookAuthor,
      review_text: reviewText,
      rating: rating,
    };

    try
    {
      const response = await axios.post( `http://localhost:5000/api/reviews/${userId}`, newReview, {headers: { Authorization: `Bearer ${token}` }});

      if(response.status === 201)
      {
        alert("Review added successfully!");
        navigate("/dashboard");
      }
      else
      {
        console.error("Unexpected response:", response);
        alert(response.error);
      }
    } 
    catch(error) 
    {
      console.error(error);
      if (error.response) 
      {
        alert(`Failed: ${error.response.data.error || "Unknown error"}`);
      } 
      else if (error.request) 
      {
        alert("No response from server. Please try again later.");
      } 
      else
      {
        alert("An error occurred while setting up the request.");
      }
    }
  };

  const handleLogout = () => 
    {
      localStorage.removeItem("authToken");
      navigate("/signin");
    };

  return (<>
  {/* NavBar */}
  <div className="navbar">
        <div className="navbar-email">
          {userEmail ? `Logged in as: ${userEmail}` : "Not logged in"}
        </div>
        <button className="navbar-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

    <div className="add-review-container">
    
      <h1>Add a Review</h1>
      <form onSubmit={handleAddReview} className="add-review-form">
        <div className="form-group">
          <label htmlFor="bookTitle">Book Title:</label>
          <input
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bookAuthor">Book Author:</label>
          <input
            type="text"
            id="bookAuthor"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reviewText">Review Text:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>);
}

export default AddReview;
