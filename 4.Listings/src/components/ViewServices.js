import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import viewServiceImage from "../assets/servLogo.png"; // Assuming image is in assets folder
import "./ViewServices.css"; // Import external CSS for styling

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore

  // Fetch services from Firestore on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = collection(db, "services"); // Fetch 'services' collection
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map((doc) => doc.data().name); // Assuming service name is stored under 'name'
      setServices(servicesList);
    };

    fetchServices();
  }, [db]);

  const handleBackClick = () => {
    navigate("/client-home");
  };

  return (
    <div className="view-services-container">
      <div className="table-container">
        <table className="table table-hover table-bordered">
          <thead style={{ backgroundColor: "#5600E8", color: "#fff" }}>
            <tr>
              <th
                style={{
                  width: "30%",
                  backgroundColor: "#5E11A2",
                  color: "white",
                }}
              >
                S. No
              </th>
              <th
                style={{
                  width: "70%",
                  backgroundColor: "#5E11A2",
                  color: "white",
                }}
              >
                Services
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#DBB2FF" }}>
            {services.length > 0 ? (
              services.map((service, index) => (
                <tr key={index}>
                  <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                    {index + 1}
                  </td>
                  <td style={{ backgroundColor: "#f2e7fe", color: "black" }}>
                    {service}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No services available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button
            className="btn custom-btn w-25 mb-4"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServices;
