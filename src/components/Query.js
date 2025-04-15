import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

const Query = () => {
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

  // Fetch existing queries from Firestore
  useEffect(() => {
    const fetchQueries = async () => {
      const querySnapshot = await getDocs(collection(db, "query"));
      const queryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueries(queryData);
    };
    fetchQueries();
  }, []);

  // Handle new question submission
  const handleAskQuestion = async (question) => {
    if (question.trim() === "") {
      Swal.fire("Please enter a question");
      return;
    }
    if (question.length > 100) {
      Swal.fire("Question should be less than 100 characters");
      return;
    }

    try {
      await addDoc(collection(db, "query"), { Q: question, A: "" });
      Swal.fire("Question submitted successfully").then(() => {
        window.location.reload(); // Reload to reflect new question
      });
    } catch (error) {
      Swal.fire("Error submitting question");
      console.error(error);
    }
  };

  // Navigate based on user role when back icon is clicked
  const handleBackNavigation = () => {
    if (storedUserData?.role === "Client") {
      navigate("/client-home");
    } else if (storedUserData?.role === "Worker") {
      navigate("/worker-home");
    } else if (storedUserData?.role === "Admin") {
      navigate("/admin-home");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <i
          className="bi bi-arrow-left-circle-fill"
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            top: "10px",
            left: "10px",
          }}
          onClick={handleBackNavigation} // Use the back navigation handler
        ></i>
        <button
          className="btn custom-btn"
          onClick={() => {
            Swal.fire({
              title: "Ask a Question",
              input: "textarea",
              inputAttributes: { maxlength: 100 },
              showCancelButton: true,
              confirmButtonText: "Submit",
            }).then((result) => {
              if (result.isConfirmed && result.value.trim() !== "") {
                handleAskQuestion(result.value); // Pass question directly to handleAskQuestion
              } else if (!result.value.trim()) {
                Swal.fire("Please enter a question");
              }
            });
          }}
        >
          Ask Question
        </button>
      </div>
      <h2
        className="text-center mt-4"
        style={{ fontWeight: "bold", color: "#5E11A2" }}
      >
        Queries
      </h2>

      <div className="mt-4">
        {queries.map((query) => (
          <div className="mb-3" key={query.id}>
            <div
              className="card"
              style={{ backgroundColor: "#f2e7fe", borderColor: "#5E11A2" }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#5E11A2" }}>
                  <span style={{ display: "inline" }}>Q:</span>{" "}
                  <span>{query.Q}</span>
                </h5>
                <span className="card-title" style={{ color: "#5E11A2" }}>
                  <h5 style={{ display: "inline" }}>A:</h5>{" "}
                  <span>{query.A || "Not yet answered"}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Query;
