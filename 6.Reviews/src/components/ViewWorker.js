import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is installed
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./ViewWorker.css";

const ViewWorker = () => {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      const db = getFirestore();
      const workersQuery = query(
        collection(db, "users"),
        where("role", "==", "Worker")
      );
      const querySnapshot = await getDocs(workersQuery);
      const workersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkers(workersData);
    };

    fetchWorkers();
  }, []);

  const formatRating = (rating, ratingGivenCount) => {
    if (rating === 0) return "N/A";
    return (rating / ratingGivenCount).toFixed(2);
  };

  const handleBackClick = () => {
    navigate("/client-home");
  };

  return (
    <div className="container">
      <div className="text-left mt-2">
        {" "}
        {/* Reduced margin-top from mt-4 to mt-2 */}
        <i
          className="bi bi-arrow-left-circle-fill"
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            top: "10px",
            left: "10px",
          }}
          onClick={() => navigate("/client-home")}
        ></i>
      </div>
      <h1
        className="text-center mt-3"
        style={{ fontWeight: "bold", color: "#5E11A2" }}
      >
        Available Workers
      </h1>
      <table className="table mt-4">
        <thead className="table-header">
          <tr>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>Name</th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Address
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Services
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {worker.name}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {worker.address}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {worker.services.map((service, index) => (
                  <div key={index}>{service}</div> // Each service in a new line
                ))}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {formatRating(worker.rating, worker.ratingGivenCount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewWorker;
