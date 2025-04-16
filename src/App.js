// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import Register from "./components/Register"; // Import Register
import ClientHome from "./components/ClientHome"; // Import ClientHome
import WorkerHome from "./components/WorkerHome"; // Import WorkerHome
import ViewWorker from "./components/ViewWorker"; // Import ViewWorker
import ViewServices from "./components/ViewServices"; // Import ViewServices
import ClientService from "./components/ClientService";
import ClientRequest from "./components/ClientRequest";
import WorkerRequest from "./components/WorkerRequest";
import WorkerAccept from "./components/WorkerAccept";
import WorkerCompleted from "./components/WorkerCompleted";
import WorkerMeeting from "./components/WorkerMeeting";
import ViewReviews from "./components/ViewReviews";
import "bootstrap/dist/css/bootstrap.css";
import ClientMeeting from "./components/ClientMeeting";
import Rating from "./components/Rating";
import WorkerHistory from "./components/WorkerHistory";
import AdminHome from "./components/AdminHome";
import AdminClient from "./components/AdminClient";
import AdminWorker from "./components/AdminWorker";
import AdminBooking from "./components/AdminBooking";
import Query from "./components/Query";
import AdminQuerys from "./components/AdminQuerys";
import Edit from "./components/edit";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-bootstrap";
import "./App.css";
import NotificationsPage from "./components/NotificationPage";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client-home" element={<ClientHome />} />
        <Route path="/worker-home" element={<WorkerHome />} />
        <Route path="/view-worker" element={<ViewWorker />} />
        <Route path="/view-services" element={<ViewServices />} />
        <Route path="/client-service" element={<ClientService />} />
        <Route path="/client-request" element={<ClientRequest />} />
        <Route path="/client-meeting" element={<ClientMeeting />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/worker-request" element={<WorkerRequest />} />
        <Route path="/worker-accept" element={<WorkerAccept />} />
        <Route path="/worker-completed" element={<WorkerCompleted />} />
        <Route path="/worker-meeting" element={<WorkerMeeting />} />
        <Route path="/worker-reviews" element={<ViewReviews />} />
        <Route path="/worker-history" element={<WorkerHistory />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-client" element={<AdminClient />} />
        <Route path="/admin-worker" element={<AdminWorker />} />
        <Route path="/admin-booking" element={<AdminBooking />} />
        <Route path="/query" element={<Query />} />
        <Route path="/admin-query" element={<AdminQuerys />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
