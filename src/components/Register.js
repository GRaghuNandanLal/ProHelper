import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Client");
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [servicesList, setServicesList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesArray = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicesList(servicesArray);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services.");
      }
    };

    fetchServices();
  }, []);

  // Password Validation Function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Contact Validation Function (Only 10 digits)
  const validateContact = (contact) => {
    const contactRegex = /^[0-9]{10}$/;
    return contactRegex.test(contact);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check password validation
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least 1 uppercase and 1 lowercase letter."
      );
      return;
    }

    // Check contact validation
    if (!validateContact(contact)) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        const userData = {
          name,
          email,
          contact,
          address,
          role,
          services: role === "Worker" ? service : [],
        };

        if (role === "Worker") {
          userData.rating = 0;
          userData.ratingGivenCount = 0;
          userData.reviews = "";
        }

        await setDoc(doc(db, "users", user.uid), userData);
      }

      await signOut(auth); // Sign out the user to reset authentication state
      navigate("/"); // Navigate back to login page
    } catch (error) {
      setError("Failed to sign up. Please check your credentials.");
    }
  };

  const handleAddService = () => {
    if (selectedService && !service.includes(selectedService)) {
      setService([...service, selectedService]);
      setSelectedService("");
    }
  };

  return (
    <div className="container w-50 mt-5">
      <div className="card mt-4 p-4 custom-shadow mb-5">
        <h1 className="text-center font-weight-bold">Register</h1>
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
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="text-muted">
              Password must be at least 8 characters, contain 1 uppercase and 1
              lowercase letter.
            </small>
          </div>
          <div className="form-group mb-3">
            <label>Contact</label>
            <input
              type="number"
              className="form-control"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <small className="text-muted">
              Contact number must be exactly 10 digits.
            </small>
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
          <div className="form-group mb-3">
            <label>Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value !== "Worker") {
                  setService([]);
                }
              }}
            >
              <option value="Client">Client</option>
              <option value="Worker">Worker</option>
            </select>
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

              <br />
              {service?.length > 0 && <label>Selected Services:</label>}
              <ul className="custom-list mb-5 mt-1">
                {service.map((s, index) => (
                  <li key={index} className="custom-list-item">
                    <button className="btn btn-sm custom-btn">{s}</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            type="submit"
            className="btn custom-btn w-100 font-weight-bold mt-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
