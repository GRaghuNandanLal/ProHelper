// Header.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import SMlogo from "../assets/SMlogo.png";
import Logout from "./Logout";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      } else {
        setRole("");
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]); // Add isLoggedIn to dependency array

  if (loading) {
    return null;
  }

  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "";
  const isRegisterPage = location.pathname === "/register";

  return (
    <header
      className="d-flex justify-content-between align-items-center p-3"
      style={{ backgroundColor: "#5E11A2" }}
    >
      <div>
        <h3 style={{ fontWeight: "bold", color: "white" }}>
          <img src="logo.png" alt="logo" height="75px" />
        </h3>
      </div>
      <div className="d-flex align-items-center">
        {isLoggedIn && role === "Client" && (
          <Link
            to="/client-service"
            className="text-light mr-3"
            style={{ textDecoration: "none", marginRight: "30px" }}
          >
            <b>Service</b>
          </Link>
        )}

        {!isLoggedIn && isLoginPage && (
          <Link to="/register" className="text-white text-decoration-none">
            Register
          </Link>
        )}

        {!isLoggedIn && isRegisterPage && (
          <Link to="/" className="text-white text-decoration-none">
            Login
          </Link>
        )}

        {isLoggedIn && (
          <>
            <Link
              to="/edit"
              className="text-light mr-3"
              style={{ textDecoration: "none", marginRight: "30px" }}
            >
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </Link>
            <Logout />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
