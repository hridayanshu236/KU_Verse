import React, { useState } from "react";
import axios from "axios";
import { Navigate, NavLink } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);

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
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "15px" }}
    >
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label
          htmlFor="email"
          style={{ marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "14px",
            width: "100%",
            marginBottom: "15px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label
          htmlFor="password"
          style={{ marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "14px",
            width: "100%",
            marginBottom: "20px",
          }}
        />
      </div>

      <button
        style={{
          backgroundColor: "#D0A9F5",
          color: "#fff",
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          ...(buttonHovered
            ? { backgroundColor: "#B80BF1", transform: "scale(1.07)" }
            : {}),
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        type="submit"
      >
        Login
      </button>

      <NavLink
        to="/forgot-password"
        style={{
          color: "#666",
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          textDecoration: "underline",
        }}
      >
        Forgot Password?
      </NavLink>
    </form>
  );
};

export default Login;
