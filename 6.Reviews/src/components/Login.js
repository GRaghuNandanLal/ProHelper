import React, { useState } from "react";
import { auth, db } from "../firebase"; // Firebase auth and Firestore imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore getDoc function
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Assuming Bootstrap is being used
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error message

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { role, name, address, contact, email } = userData;

          // Store user data in sessionStorage
          sessionStorage.setItem(
            "userData",
            JSON.stringify({
              name,
              address,
              contact,
              email,
              role,
              id: user.uid,
            })
          );

          // Redirect based on role
          if (role === "Client") {
            navigate("/client-home", { state: { name, role } }); // Passing name and role to ClientHome
          } else if (role === "Worker") {
            navigate("/worker-home", { state: { name, role } }); // Passing name and role to WorkerHome
          } else if (role === "Admin") {
            navigate("/admin-home", { state: { name, role } });
          }
        } else {
          setError("User data not found.");
        }
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="container w-50">
      <div className="row m-5 no-gutters shadow-lg custom-shadow">
        <div className="bg-white p-5">
          <h3 className="pb-3">Login</h3>
          <div className="form-style">
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group pb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2">
                <button
                  type="submit"
                  className="btn custom-btn w-100 font-weight-bold mt-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
