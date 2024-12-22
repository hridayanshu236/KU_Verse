import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";

const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #D6A4FF, #F2F2FF)", // Light purple to white background outside the card
    fontFamily: "'Roboto', sans-serif",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #D6A4FF, #B88BF1, #F2F2FF)", // Gradient for the card background
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

  const linkStyle = {
    color: isHovered ? "#B80BF1" : "#D0A9F5", // Change color based on hover state
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease, transform 0.2s ease",
    transform: isHovered ? "scale(1.05)" : "none", // Slight scale-up effect on hover
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>Login</h1>
        <Login />
        <p style={footerTextStyle}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={linkStyle}
            onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
