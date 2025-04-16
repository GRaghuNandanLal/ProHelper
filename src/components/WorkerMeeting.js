import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

const WorkerMeeting = () => {
  const [bookings, setBookings] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const db = getFirestore();
  const navigate = useNavigate();

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

            const upcomingMeetings = bookingData.meeting.filter((meeting) => {
              const meetingDate = moment(meeting, "DD-MM-YYYY HH:mm");
              return meetingDate.isSameOrAfter(moment(), "day");
            });

            if (upcomingMeetings.length > 0) {
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
            return null;
          })
          .filter((booking) => booking !== null);

        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchUnreadNotifications = async () => {
      const notificationRef = collection(db, "notifications");
      const q = query(
        notificationRef,
        where("userId", "==", workerId),
        where("status", "==", "unread")
      );
      const querySnapshot = await getDocs(q);

      setUnreadNotificationsCount(querySnapshot.size);
    };

    fetchBookings();
    fetchUnreadNotifications();
  }, [db, workerId]);

  return (
    <div className="container mt-5">
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
        {unreadNotificationsCount > 0 && (
          <span className="badge bg-danger ms-2">
            {unreadNotificationsCount}
          </span>
        )}
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
