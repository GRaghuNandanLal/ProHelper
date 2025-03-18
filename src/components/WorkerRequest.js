import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase"; // assuming firebase is configured in this file
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const WorkerRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Get logged-in user data from session storage
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const workerId = storedUserData.id;

  // Fetch pending requests from Firebase
  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(
        collection(db, "booking"),
        where("wid", "==", workerId),
        where("status", "==", "Pending")
      );
      const querySnapshot = await getDocs(q);
      const requestsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsList);
    };
    fetchRequests();
  }, [workerId]);

  // Handle Approve or Reject action
  const handleAction = async (requestId, newStatus) => {
    const requestRef = doc(db, "booking", requestId);
    await updateDoc(requestRef, { status: newStatus });
    setModalMessage(
      newStatus === "In-Progress"
        ? "Successfully accepted!"
        : "Successfully rejected!"
    );
    setShowModal(true);
  };

  // Close modal and refresh page
  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="container mt-4">
      {/* Back arrow to worker-home */}
      <i
        className="bi bi-arrow-left-circle-fill"
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          top: "10px",
          left: "10px",
        }}
        onClick={() => navigate("/worker-home")}
      ></i>

      <h2
        className="text-center mb-4"
        style={{ fontWeight: "bold", color: "#5E11A2" }}
      >
        Service Requests
      </h2>

      <Table striped bordered hover>
        <thead>
          <tr style={{ backgroundColor: "#5600E8", color: "#ffffff" }}>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>Name</th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Address
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Service
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Description
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {request.cname}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {request.caddress}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {request.service}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {request.description}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handleAction(request.id, "In-Progress")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleAction(request.id, "Reject")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No Pending Requests
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Action Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkerRequest;
