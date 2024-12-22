import React, { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "../components/Signup";

const SignupPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Outer container with the same gradient as the login page
  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #D6A4FF, #F2F2FF)", // Purple-pink gradient
    fontFamily: "'Roboto', sans-serif",
    
  };

  // Card container with a more pronounced gradient
  const cardStyle = {
    background: "linear-gradient(135deg, #D6A4FF, #B88BF1, #F2F2FF)", // Gradient for the card background
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // Shadow for depth
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    minHeight: "600px", // Ensures enough space for all content
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  // Card header styling
  const headerStyle = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#6A1B9A", // Deep purple for header text
  };

  // Footer text styling
  const footerTextStyle = {
    marginTop: "20px",
    fontSize: "14px",
    color: "#6A1B9A", // Light purple for footer
  };

  // Link styling with hover effects
  const linkStyle = {
    color: isHovered ? "#C2185B" : "#AD1457", // Brighter pink on hover
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease, transform 0.2s ease",
    transform: isHovered ? "scale(1.05)" : "none", // Slight scale-up on hover
    borderBottom: isHovered ? "2px solid #C2185B" : "none", // Underline on hover
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>Sign Up</h1>
        <Signup />
        <p style={footerTextStyle}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={() => setIsHovered(true)} // Hover effect on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Reset hover effect on leave
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
