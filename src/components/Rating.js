import { useState } from "react";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const Rating = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const db = getFirestore();

  // Get the booking ID, worker ID, and service from state
  const { bookingId, workerId, service } = location.state;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  // Validate input before submission
  const validateInput = () => {
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return false;
    }
    if (review.length === 0 || review.length > 200) {
      setError("Review must be between 1 and 200 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const userRef = doc(db, "users", workerId);

    try {
      // Get the current worker data
      const workerSnap = await getDoc(userRef);
      if (workerSnap.exists()) {
        const workerData = workerSnap.data();

        // Create a new review entry with service, rating, and review
        const newReview = service + "*-*" + rating + "*-*" + review;

        // Update the user's rating and reviews
        const updatedRating = workerData.rating + rating;
        const updatedCount = workerData.ratingGivenCount + 1;

        await updateDoc(userRef, {
          rating: updatedRating,
          ratingGivenCount: updatedCount,
          reviews: [...workerData.reviews, newReview], // Add the new review array
        });

        // Update booking's wratingstatus to 1
        const bookingRef = doc(db, "booking", bookingId);
        await updateDoc(bookingRef, {
          wratingstatus: 1,
        });

        // Create a notification for the worker
        const notification = {
          workerId: workerId,
          message: `You received a new rating for the service: ${service}. Rating: ${rating}/5. Review: ${review}`,
          timestamp: new Date(),
          seen: false, // Initially, the notification is not seen
        };

        // Save the notification to Firestore in the notifications collection
        await addDoc(collection(db, "notifications"), notification);

        // Redirect to /client-service
        navigate("/client-service");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header text-center">
          <h5>Rate the Worker</h5>
        </div>
        <div className="card-body">
          <div className="text-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi bi-star${star <= rating ? "" : "-fill"}`}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: star <= rating ? "#FFD700" : "#ccc",
                }}
              />
            ))}
          </div>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="Write your review (up to 200 characters)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={200}
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex justify-content-center">
            <button className="btn custom-btn me-2" onClick={handleSubmit}>
              Submit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/client-service")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
