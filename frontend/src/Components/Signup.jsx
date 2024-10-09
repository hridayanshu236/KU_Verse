import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data); 

      } else {
        console.error("Error message:", error.message); 
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
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
      <input
        type="text"
        name="userName"
        placeholder="Username"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dateofBirth"
        placeholder="YYYY-MM-DD" 
        value={formData.dateofBirth}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
