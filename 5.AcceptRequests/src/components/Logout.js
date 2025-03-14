import React from 'react';
import { auth } from '../firebase'; // Firebase auth import
import { signOut } from 'firebase/auth'; // Firebase signOut function
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-light">
      Logout
    </button>
  );
};

export default Logout;
