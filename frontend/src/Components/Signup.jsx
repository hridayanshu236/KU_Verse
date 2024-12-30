import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchDepartments } from "../utils/profileInfo";
import FileUpload from "./FileUpload";

const Signup = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    fullName: "",
    phoneNumber: "",
    dateofBirth: "",
    address: "",
    department: "",
  });
  const [file, setFile] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(data.departments);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordError(
        value !==
          (name === "password" ? formData.confirmPassword : formData.password)
          ? "Passwords do not match"
          : ""
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const submitFormData = new FormData();
    const { confirmPassword, ...dataToSubmit } = formData;
    Object.entries(dataToSubmit).forEach(([key, value]) => {
      submitFormData.append(key, value);
    });
    if (file) submitFormData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        submitFormData
      );
      localStorage.setItem("userEmail", formData.email);
      if (response.data.user._id)
        localStorage.setItem("userId", response.data.user._id);
      navigate("/otp-verification");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    marginBottom: "15px",
  };

  const columnContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  };

  const passwordContainerStyle = {
    position: "relative",
    width: "100%",
  };

  const togglePasswordStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
  };

  return (
    <form onSubmit={handleSubmit} style={columnContainerStyle}>
      <div style={{ gridColumn: "1 / -1" }}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={passwordContainerStyle}>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={togglePasswordStyle}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div style={passwordContainerStyle}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={togglePasswordStyle}
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {passwordError && (
        <div
          style={{
            gridColumn: "1 / -1",
            color: "red",
            fontSize: "12px",
            marginTop: "-10px",
            marginBottom: "15px",
          }}
        >
          {passwordError}
        </div>
      )}

      <input
        type="text"
        name="userName"
        placeholder="Username"
        value={formData.userName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        value={formData.fullName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="date"
        name="dateofBirth"
        value={formData.dateofBirth}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>

      <div style={{ gridColumn: "1 / -1" }}>
        <FileUpload onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button
        type="submit"
        style={{
          gridColumn: "1 / -1",
          padding: "12px",
          background: isHovered ? "#6A1B9A" : "#E1BEE7",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "all 0.3s ease",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          marginTop: "15px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
