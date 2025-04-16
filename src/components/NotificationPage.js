import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const db = getFirestore();
  const navigate = useNavigate();

  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const [role, setRole] = useState(storedUserData?.role);
  const userId = storedUserData.id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationRef = collection(db, "notifications");
        const q = query(notificationRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message,
          timestamp: doc.data().timestamp,
          status: doc.data().status,
        }));

        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [db, userId]);

  const markAsRead = async (notificationId) => {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      status: "read",
    });

    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };

  const handleBack = () => {
    console.log(role);
    if (role === "Client") {
      navigate("/client-home");
    } else if (role === "Worker") {
      navigate("/worker-home");
    } else if (role === "Admin") {
      navigate("/admin-home");
    }
  };

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
        onClick={handleBack}
      ></i>

      <h2
        className="text-center mb-4"
        style={{ fontWeight: "bold", color: "#5E11A2" }}
      >
        Notifications
      </h2>

      {notifications.length > 0 ? (
        <ul className="list-group">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`list-group-item ${
                notification.status === "read"
                  ? "list-group-item-secondary"
                  : "list-group-item-primary"
              }`}
            >
              <div>
                <p>{notification.message}</p>
                <small>
                  {new Date(
                    notification.timestamp.seconds * 1000
                  ).toLocaleString()}
                </small>
              </div>
              {notification.status === "unread" && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationsPage;
