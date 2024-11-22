import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode correctly
import Rating from "@mui/material/Rating";
import "../assets/updateReview.css";

function UpdateReview() {
  const { id } = useParams(); // Get book_id (review.id) from the route
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const userEmail = token ? jwtDecode(token).email : null; // Get email from token

  useEffect(() => {
    //________fetch current reviews_________________________________
    const fetchReviewDetails = async () => 
    {
      if (!token) 
      {
        alert("You are not logged in. Redirecting to login page...");
        navigate("/signin");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try 
      {
        // Fetch review details by userId and bookId=id
        const response = await axios.get(`http://localhost:5000/api/review/${userId}/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviewText(response.data.review_text);
        setRating(response.data.rating);
      } 
      catch (error) 
      {
        alert("Failed to fetch review details.");
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [id, token, navigate]);



  //__________________update reviews____________________________________________
  const handleUpdate = async (e) => 
  {
    e.preventDefault();

    const updatedReview = {
      review_text: reviewText,
      rating: rating
    };

    try 
    {
      const token = localStorage.getItem("authToken");
      if (!token) 
      {
        alert("Session expired");
        navigate("/signin");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      
      const result = await axios.put( `http://localhost:5000/api/reviews/${userId}/${id}`, updatedReview,{headers: { Authorization: `Bearer ${token}` }});
      if (result.status === 200) 
      {
        alert("Review updated successfully.");
        navigate("/dashboard");
      } 
      else 
      {
        console.log(result);
      }
    } 
    catch (error) 
    {
      console.error(error);
    
      if(error.response) 
      {
        alert(`Failed: ${error.response.data.error || "Unknown error"}`);
      } 
      else if (error.request) 
      {
        alert("Failed: No response from server.");
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

  if (loading) return <div>Loading...</div>;

  return (<>{/* NavBar */}
    <div className="navbar">
        <div className="navbar-email">
          {userEmail ? `Logged in as: ${userEmail}` : "Not logged in"}
        </div>
        <button className="navbar-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

    <div className="update-container">
      <h1>Update Review</h1>
      <form onSubmit={handleUpdate} className="update-form">
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
        <button type="submit" className="update-button">
          Update
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  </>);
}

export default UpdateReview;
