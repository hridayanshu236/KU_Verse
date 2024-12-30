import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    fullName: "",
    phoneNumber: "",
    dateofBirth: "",
    address: "",
    department: "",
  });

  const [file, setFile] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitFormData.append(key, formData[key]);
    });
    if (file) {
      submitFormData.append("file", file);
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        submitFormData
      );

      // Store both email and token
      localStorage.setItem("userEmail", formData.email);
      if (response.data.user._id) {
        localStorage.setItem("userId", response.data.user._id);
      }

      // Get token from cookies (since your backend uses httpOnly cookies)
      navigate("/otp-verification");
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };
  const buttonStyle = {
    padding: "10px",
    background: isHovered ? "#6A1B9A" : "#E1BEE7", // Dark purple on hover, light purple otherwise
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background-color 0.3s ease", // Smooth transition for hover effect
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        textAlign: "center",
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="text"
        name="userName"
        placeholder="Enter your username"
        value={formData.userName}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="text"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Enter your phone number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="date"
        name="dateofBirth"
        placeholder="YYYY-MM-DD"
        value={formData.dateofBirth}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="text"
        name="address"
        placeholder="Enter your address"
        value={formData.address}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        type="text"
        name="department"
        placeholder="Enter your department"
        value={formData.department}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <input
        accept="image/*"
        type="file"
        id="picture"
        onChange={changeFileHandler}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Signup
      </button>
    </form>
  );
};

export default Signup;
