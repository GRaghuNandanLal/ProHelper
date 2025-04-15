import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import norequest from "../assets/norequest.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";

const ClientService = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // State for the selected booking's meeting
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const db = getFirestore();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userData?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, "booking"), where("cid", "==", userId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setBookings(null);
      } else {
        const bookingData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingData);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [db, userId]);

  const handleShowMeeting = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (bookings === null) {
    return (
      <div className="container">
        <div className="d-flex justify-content-end">
          <button
            className="mb-3 mt-3"
            style={{ backgroundColor: "#5E11A2", color: "white" }}
            onClick={() => navigate("/client-request")}
          >
            Raise Request
          </button>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img
            src={norequest}
            alt="No Requests"
            style={{ width: "300px", height: "300px" }}
          />
          <button
            className="mb-3 mt-3"
            style={{ backgroundColor: "#5E11A2", color: "white" }}
            onClick={() => navigate("/client-home")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <button
          className="btn mb-3 mt-3"
          style={{ backgroundColor: "#5E11A2", color: "white" }}
          onClick={() => navigate("/client-request")}
        >
          Raise Request
        </button>
      </div>

      <table className="table table-bordered" style={{ padding: "20px" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Worker Name
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Service
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Contact
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Email
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Status
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
              Meeting
            </th>
            <th style={{ backgroundColor: "#5E11A2", color: "white" }}>Rate</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.wname}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.service}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.wcontact}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.wmail}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.status}
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                <i
                  className="bi bi-calendar-date"
                  onClick={() => handleShowMeeting(booking)}
                  style={{ cursor: "pointer" }}
                />
              </td>
              <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                {booking.status === "Pending" ||
                booking.status === "Stopped by Admin" ? (
                  "N/A"
                ) : booking.wratingstatus === 0 ? (
                  <i
                    className="bi bi-star"
                    onClick={() =>
                      navigate("/rating", {
                        state: {
                          bookingId: booking.id,
                          workerId: booking.wid,
                          service: booking.service,
                        },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <i className="bi bi-star-fill" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <button
          className="btn mb-3 mt-3"
          style={{ backgroundColor: "#5E11A2", color: "white" }}
          onClick={() => navigate("/client-home")}
        >
          Back
        </button>
      </div>

      {/* Meeting Modal */}
      {showModal && selectedBooking && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Meeting Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedBooking.meeting &&
                selectedBooking.meeting.length > 0 ? (
                  selectedBooking.meeting.map((meeting, index) => (
                    <div
                      key={index}
                      className="card mb-2"
                      style={{ backgroundColor: "#e0f7fa" }}
                    >
                      <div className="card-body">{meeting}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#5E11A2", fontWeight: "bold" }}>
                    No meeting scheduled
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientService;
