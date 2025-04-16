// src/components/ClientHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ClientHome.css";

const ClientHome = () => {
  const navigate = useNavigate();
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const { name } = storedUserData || {};

  const handleViewServices = () => {
    navigate("/view-services");
  };

  const handleViewWorker = () => {
    navigate("/view-worker");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center greeting">Hello, {name}!</h1>
      <div className="d-flex justify-content-around mt-5">
        {/* Available Services Card */}
        <div className="card custom-shadow mb-5 mx-3">
          <img
            src="https://www.shutterstock.com/shutterstock/videos/3471346707/thumb/9.jpg?ip=x480"
            className="card-img-top"
            alt="Services"
            style={{ width: "100%", height: "18rem" }}
          />
          <div className="card-body p-5 pb-2">
            <h5 className="card-title">Available Services</h5>
            <p className="card-text">
              Explore our services and find the one that fits your needs.
            </p>
            <div className="mt-auto d-flex justify-content-center">
              <button
                className="btn custom-btn w-25"
                onClick={handleViewServices}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Workers Card */}
        <div className="card custom-shadow mb-5 mx-3">
          <img
            src="https://c0.wallpaperflare.com/preview/19/153/130/business-background-illustration-people.jpg"
            className="card-img-top"
            alt="Workers"
            style={{ width: "100%", height: "18rem" }}
          />
          <div className="card-body p-5 pb-2">
            <h5 className="card-title">Workers</h5>
            <p className="card-text">
              Browse through our skilled workers ready to help you.
            </p>
            <div className="mt-auto d-flex justify-content-center">
              <button
                className="btn custom-btn w-25"
                onClick={handleViewWorker}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card custom-shadow mb-5 mx-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsRZSlS5tMGTXvoz-KlawtA50AD8vxoOoc4Q&s"
            className="card-img-top"
            alt="Workers"
            style={{ width: "100%", height: "18rem" }}
          />
          <div className="card-body p-5 pb-2">
            <h5 className="card-title">Notifications</h5>
            <p className="card-text">
              Browse through our skilled workers ready to help you.
            </p>
            <div className="mt-auto d-flex justify-content-center">
              <button
              className="btn custom-btn"
                onClick={() => navigate("/notifications")}
              >
                View Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
