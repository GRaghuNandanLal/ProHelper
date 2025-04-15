import React, { useState, useEffect } from "react";
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
import { Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import DatePicker from "react-datepicker"; // install react-datepicker if not already installed
import "react-datepicker/dist/react-datepicker.css";

const WorkerAccept = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCompleteModal, setShowCompleteModal] = useState(false); // For success popup after complete

  // Get logged-in user data from session storage
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const workerId = storedUserData.id;

  // Fetch in-progress requests from Firebase
  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, "booking"), where("wid", "==", workerId));
      const querySnapshot = await getDocs(q);
      const requestsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsList);
    };
    fetchRequests();
  }, [workerId]);

  // Open modal to select date and time for the meeting
  const handleMeetingClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Handle meeting date submission
  const handleMeetingSubmit = async () => {
    if (selectedRequest && selectedDate) {
      const formattedDate = `${selectedDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${selectedDate.getFullYear()} ${selectedDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${selectedDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const updatedMeetingArray = [
        ...(selectedRequest.meeting || []),
        formattedDate,
      ];

      // Update the booking document in Firestore
      const requestRef = doc(db, "booking", selectedRequest.id);
      await updateDoc(requestRef, { meeting: updatedMeetingArray });

      // Close modal and refresh data
      setShowModal(false);
      window.location.reload(); // Refresh the page after successful submission
    }
  };

  // Handle completion of a request
  const handleComplete = async (requestId) => {
    const requestRef = doc(db, "booking", requestId);
    await updateDoc(requestRef, { status: "Complete" });

    // Show success popup after status update
    setShowCompleteModal(true);
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
        Completed Requests
      </h2>

      <Table striped bordered hover>
        <thead>
          <tr style={{ backgroundColor: "#5600E8", color: "#ffffff" }}>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>Name</th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Address
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Contact
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Service
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Description
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Complete
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => {
              const lastMeeting =
                request.meeting && request.meeting.length > 0
                  ? request.meeting[request.meeting.length - 1]
                  : "N/A";
              return (
                <tr key={request.id}>
                  <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                    {request.cname}
                  </td>
                  <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                    {request.caddress}
                  </td>
                  <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                    {request.ccontact}
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
                      style={{
                        backgroundColor: "#28a745",
                        borderColor: "#28a745",
                      }}
                    >
                      Complete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No Completed Requests
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for scheduling meeting */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Date and Time</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm"
                minDate={new Date()} // Prevent past dates
                className="form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMeetingSubmit}>
            Save Meeting
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal after completion */}
      <Modal
        show={showCompleteModal}
        onHide={() => setShowCompleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Request has been successfully marked as <strong>Complete</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => window.location.reload()}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkerAccept;
