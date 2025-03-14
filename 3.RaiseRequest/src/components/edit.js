import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [servicesList, setServicesList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name);
          setEmail(userData.email);
          setContact(userData.contact);
          setAddress(userData.address);
          setRole(userData.role);
          setService(userData.services || []);
        }
      }
    };

    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesArray = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicesList(servicesArray);
      } catch (error) {
        setError("Failed to load services.");
      }
    };

    fetchUserData();
    fetchServices();
  }, []);

  const handleBack = () => {
    if (role === "Client") {
      navigate("/client-home");
    } else if (role === "Worker") {
      navigate("/worker-home");
    } else if (role === "Admin") {
      navigate("/admin-home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const updatedData = {
          name,
          email,
          contact,
          address,
          role,
          services: role === "Worker" ? service : [],
        };

        await updateDoc(userRef, updatedData);

        // Navigate to the correct home screen based on role
        handleBack();
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleAddService = () => {
    if (selectedService && !service.includes(selectedService)) {
      setService([...service, selectedService]);
      setSelectedService("");
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setService(service.filter((s) => s !== serviceToRemove));
  };

  return (
    <div className="container mt-5">
      {/* Back icon positioned at the top left */}
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
      <div className="card mt-4 p-4">
        <h1 className="text-center font-weight-bold">Edit Profile</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled // Email should not be editable
            />
          </div>
          <div className="form-group mb-3">
            <label>Contact</label>
            <input
              type="text"
              className="form-control"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          {role === "Worker" && (
            <>
              <div className="form-group mb-3">
                <label>Services</label>
                <select
                  className="form-control"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {servicesList.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={handleAddService}
              >
                Add Service
              </button>
              <ul className="list-group mb-3">
                {service.map((s, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between"
                  >
                    {s}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveService(s)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="submit" className="btn custom-btn w-100 btn-block">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
