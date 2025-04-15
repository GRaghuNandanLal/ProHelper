// Signup.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Client');
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [servicesList, setServicesList] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const servicesArray = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicesList(servicesArray);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services.');
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
          services: role === 'Worker' ? service : [],
        };

        if (role === 'Worker') {
          userData.rating = 0;
          userData.ratingGivenCount = 0;
          userData.reviews = '';
        }

        await setDoc(doc(db, 'users', user.uid), userData);
      }

      await signOut(auth); // Sign out the user to reset authentication state
      navigate('/'); // Navigate back to login page
    } catch (error) {
      setError('Failed to sign up. Please check your credentials.');
    }
  };

  const handleAddService = () => {
    if (selectedService && !service.includes(selectedService)) {
      setService([...service, selectedService]);
      setSelectedService('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mt-4 p-4">
        <h1 className="text-center font-weight-bold">Sign Up</h1>
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
          <div className="form-group mb-3">
            <label>Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value !== 'Worker') {
                  setService([]);
                }
              }}
            >
              <option value="Client">Client</option>
              <option value="Worker">Worker</option>
            </select>
          </div>
          {role === 'Worker' && (
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
                  <li key={index} className="list-group-item">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
