import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignup.scss";
const URL = import.meta.env.VITE_ADDRESS;

// Create Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: URL,
});


const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); // React Router v6 hook to navigate

  // Check if the user is already logged in when they visit the page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowModal(true); // Show modal if user is already logged in
      setTimeout(() => {
        navigate("/"); // Redirect to main page after showing modal for 2 seconds
      }, 2000);
    }
  }, [navigate]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for login or signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        // Login request
        response = await axiosInstance.post("/login", {
          username: formData.username,
          password: formData.password,
        });
        console.log("Login Success:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", response.data.isAdmin);

        navigate("/"); // Redirect to main page after successful login
      } else {
        // Signup request
        response = await axiosInstance.post("/signup", formData);
        console.log("Signup Success:", response.data);
        setIsLogin(true); // Switch to login form after signup
      }

      setErrorMessage(""); // Clear error message on success
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        "Authentication failed. Please check your credentials.";
      setErrorMessage(errorMsg);
    }
  };

  // Toggle between login and signup modes
  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(""); // Clear error when toggling form
  };

  return (
    <div className="login-signup">
      <div className="form-container">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="submit-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button className="toggle-button" onClick={toggleFormMode}>
          {isLogin ? "Switch to Signup" : "Switch to Login"}
        </button>
      </div>

      {/* Modal popup for already logged in */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>You are already logged in! Redirecting to the main page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
