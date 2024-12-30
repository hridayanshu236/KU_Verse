import React from "react";
import OtpVerification from "../Components/OtpVerification";

const OtpVerificationPage = () => {
  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #D6A4FF, #F2F2FF)", // Purple-pink gradient
    fontFamily: "'Roboto', sans-serif",
  };
  const cardStyle = {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  };
  return (
    
    <div style={pageStyle}>
    <div style={cardStyle}>
      <OtpVerification />
    </div>
  </div>
);
};

export default OtpVerificationPage;
