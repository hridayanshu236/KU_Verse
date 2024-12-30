import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");

      if (!storedEmail) {
        setError("Session expired. Please register again.");
        setTimeout(() => navigate("/signup"), 2000);
        return false;
      }

      setEmail(storedEmail);
      return true;
    };

    checkAuthStatus();
  }, [navigate]);

  const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem("authToken");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/verifyemail", {
        email,
        code: otp,
      });
      if (response.data.success) {
        setSuccess("Email verified successfully!");
        localStorage.removeItem("userEmail");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Verification failed.");
      setOtp(""); // Clear invalid OTP
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/api/auth/resend-otp", { email });

      setSuccess("New OTP has been sent to your email");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the 6-digit OTP sent to
            <br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${
                  loading
                    ? "bg-purple-400"
                    : "bg-purple-600 hover:bg-purple-700"
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="flex justify-between items-center">
              <button
                onClick={resendOtp}
                disabled={loading}
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                Resend OTP
              </button>

              <button
                onClick={() => navigate("/signup")}
                disabled={loading}
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
