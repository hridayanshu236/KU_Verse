import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState(""); // Stores the OTP entered by the user
  const [success, setSuccess] = useState(""); // Stores success messages
  const [error, setError] = useState(""); // Stores error messages
  const [buttonHovered, setButtonHovered] = useState(false); // Button hover state
  const navigate = useNavigate();

  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/verifyemail",
        { code: otp },
        {
          headers: {
            "Content-Type": "application/json"},
        }
      );

      if (response.data.success) {
        setSuccess("OTP verified successfully. Redirecting to login...");
        setError("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        verifyOtp();
      }}
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", textAlign: "center" }}>
        OTP Verification
      </h2>
      <p style={{ fontSize: "14px", color: "#555", textAlign: "center" }}>
        Please enter the OTP sent to your email to verify your account.
      </p>
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      {success && <p style={{ color: "green", fontSize: "14px" }}>{success}</p>}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <label htmlFor="otp" style={{ marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
          Enter OTP
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter your OTP"
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
      <button
        style={{
          backgroundColor: "#D0A9F5", // Lavender button color
          color: "#fff", // White text color
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          ...(buttonHovered ? { backgroundColor: "#B80BF1", transform: "scale(1.02)" } : {}),
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        type="submit"
      >
        Verify OTP
      </button>
    </form>
  );
};

export default OtpVerification;
