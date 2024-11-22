import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../assets/dashboard.css";


function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [allreviews, setallreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const userEmail = token ? jwtDecode(token).email : null; // Get email from token

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) {
        alert("You are not logged in. Redirecting to login page...");
        navigate("/signin");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await axios.get(`http://localhost:5000/api/reviews/${userId}`, {    //get logged in user's reviews
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);

        const get_all = await axios.get('http://localhost:5000/api/reviews');  //get all reviews
        setallreviews(get_all.data);
      } 
      catch (error) 
      {
        console.error("Error fetching reviews:", error);
        alert("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((review) => review.id !== id));
      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete the review.");
    }
  };

  const handleLogout = () => 
  {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <div>Please log in to view your reviews.</div>;
  }

  return (
    <div>
      {/* NavBar */}
      <div className="navbar">
        <div className="navbar-email">
          {userEmail ? `Logged in as: ${userEmail}` : "Not logged in"}
        </div>
        <button className="navbar-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="first-block">
          <button className="dashboard-button update" onClick={() => navigate('/addReview')}>Add Your Review</button>
          <div className="average-rate">
            <p>
              Average of your Ratings: 
              {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2) : "No ratings available"}
            </p>
          </div>

        </div>
        <h1 className="dashboard-title">Your Reviews</h1>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.book_id}>
                <td>{review.book_title}</td>
                <td>{review.book_author}</td>
                <td>{review.rating}</td>
                <td>{review.review_text}</td>
                <td>{new Date(review.date_added).toLocaleDateString()}</td>
                <td>
                  <button
                    className="dashboard-button update"
                    onClick={() => navigate(`/updateReview/${review.book_id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="dashboard-button delete"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <h1 className="dashboard-title">All Reviews</h1>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {allreviews.map((item) => (
              <tr key={item.book_id}>
                <td>{item.book_title}</td>
                <td>{item.book_author}</td>
                <td>{item.rating}</td>
                <td>{item.review_text}</td>
                <td>{new Date(item.date_added).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;