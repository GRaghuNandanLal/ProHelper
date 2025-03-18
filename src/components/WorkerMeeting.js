import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import moment from "moment"; // To handle date comparison
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap icons

const WorkerMeeting = () => {
  const [bookings, setBookings] = useState([]);
  const db = getFirestore();
  const navigate = useNavigate();

  // Retrieve worker ID from session storage
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const workerId = storedUserData.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingCollection = collection(db, "booking");
        const q = query(bookingCollection, where("wid", "==", workerId));
        const bookingSnapshot = await getDocs(q);

        const fetchedBookings = bookingSnapshot.docs
          .map((doc) => {
            const bookingData = doc.data();

            // Filter meetings to only include future dates or today
            const upcomingMeetings = bookingData.meeting.filter((meeting) => {
              const meetingDate = moment(meeting, "DD-MM-YYYY HH:mm");
              return meetingDate.isSameOrAfter(moment(), "day");
            });

            // Only keep bookings that have at least one valid future meeting date
            if (upcomingMeetings.length > 0) {
              // Sort meetings in ascending order and keep the latest valid date
              const latestMeeting = upcomingMeetings.sort(
                (a, b) =>
                  moment(a, "DD-MM-YYYY HH:mm") - moment(b, "DD-MM-YYYY HH:mm")
              )[0];

              return {
                id: doc.id,
                name: bookingData.cname,
                service: bookingData.service,
                address: bookingData.caddress,
                meeting: latestMeeting,
              };
            }
            return null; // Exclude bookings with no future meetings
          })
          .filter((booking) => booking !== null); // Filter out null values

        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [db, workerId]);

  return (
    <div className="container mt-5">
      {/* Back Arrow Icon */}
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
        Meetings
      </h2>

      {bookings.length > 0 ? (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
                Name
              </th>
              <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
                Service
              </th>
              <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
                Address
              </th>
              <th style={{ backgroundColor: "#5E11A2", color: "white" }}>
                Meeting
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {booking.name}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {booking.service}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {booking.address}
                </td>
                <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                  {booking.meeting}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No upcoming meetings found.</p>
      )}
    </div>
  );
};

export default WorkerMeeting;
