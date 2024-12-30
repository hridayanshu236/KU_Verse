import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      setErrorMessage("Session expired. Please register again.");
      setTimeout(() => navigate("/signup"), 2000);
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verifyemail", { email, code: otp });
      setSuccessMessage(response.data.message || "Email verified successfully!");
      setErrorMessage("");
      localStorage.removeItem("userEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed. Please try again.");
      setSuccessMessage("");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setSuccessMessage("A new OTP has been sent to your email.");
      setErrorMessage("");
    } catch {
      setErrorMessage("Failed to resend OTP. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "50px", alignItems: "center" }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#6A1B9A", marginBottom: "20px" }}>
        OTP Verification
      </h2>
      <p style={{ color: "#555", fontSize: "14px" }}>
        Please enter the OTP sent to your email: <strong>{email}</strong>
      </p>
      {errorMessage && <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", fontSize: "14px" }}>{successMessage}</p>}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter OTP"
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
          textAlign: "center",
          width: "100%",
          maxWidth: "300px",
          marginBottom: "15px",
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "#D0A9F5",
          color: "#fff",
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%", // Match the input's width
          maxWidth: "300px", // Match the input's maxWidth
          
          ...(buttonHovered ? { backgroundColor: "#B80BF1", transform: "scale(1.1)" } : {}),
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        Verify
      </button>
      <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "300px" }}>
  <span
    onClick={resendOtp}
    style={{
      color: "#6A1B9A",
      fontSize: "12px",
      textDecoration: "none",
      cursor: "pointer",
     
    }}
    onMouseEnter={(e) => {
      e.target.style.textDecoration = "underline";
      e.target.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.target.style.textDecoration = "none";
      e.target.style.transform = "scale(1)";
    }}
  >
    Resend OTP
  </span>
  <span
    onClick={() => navigate("/signup")}
    style={{
      color: "#6A1B9A",
      fontSize: "12px",
      textDecoration: "none",
      cursor: "pointer",
      
    }}
    onMouseEnter={(e) => {
      e.target.style.textDecoration = "underline";
      e.target.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.target.style.textDecoration = "none";
      e.target.style.transform = "scale(1)";
    }}
  >
    Back to Sign Up
  </span>
</div>
    </form>
  );
};

export default OtpVerification;
