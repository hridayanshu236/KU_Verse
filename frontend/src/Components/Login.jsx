import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData, 
        { withCredentials: true } 
      );
      console.log(response.data);
      setIsLoggedIn(true); 
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        setError(error.response.data.message || "An error occurred"); 
      } else {
        console.error("Error during request:", error.message);
        setError("Network error. Please try again.");
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
