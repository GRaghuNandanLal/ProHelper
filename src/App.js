import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.css";
import Edit from "./components/edit";
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
        <Route path="/edit" element={<Edit />} />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
