import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgotpassword",
        { email },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError(error.response?.data.message || "An error occurred");
      setMessage(null);
    }
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #D6A4FF, #F2F2FF)",
    fontFamily: "'Roboto', sans-serif",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #D6A4FF, #B88BF1, #F2F2FF)",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  };

  const headerStyle = {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
  };

  const footerTextStyle = {
    marginTop: "20px",
    fontSize: "14px",
    color: "#888",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>Reset Password</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          {message && (
            <p style={{ color: "green", fontSize: "14px" }}>{message}</p>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label
              htmlFor="email"
              style={{
                marginBottom: "5px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
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
            Send Reset Link
          </button>
        </form>

        <p style={footerTextStyle}>
          <Link
            to="/login"
            style={{
              color: "#6B3FA0",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
