import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import Register from "./components/Register";
import ClientHome from "./components/ClientHome";
import WorkerHome from "./components/WorkerHome";
import ViewWorker from "./components/ViewWorker";
import ClientService from "./components/ClientService";
import ClientRequest from "./components/ClientRequest";
import "bootstrap/dist/css/bootstrap.css";
import ClientMeeting from "./components/ClientMeeting";
import Rating from "./components/Rating";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-bootstrap";
import "./App.css";

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
        <Route path="/client-service" element={<ClientService />} />
        <Route path="/client-request" element={<ClientRequest />} />
        <Route path="/client-meeting" element={<ClientMeeting />} />
        <Route path="/rating" element={<Rating />} />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
