import React from "react";
import OtpVerification from "../Components/OtpVerification";

const OtpVerificationPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #D6A4FF, #F2F2FF)", 
      }}
    >
      <OtpVerification />
    </div>
  );
};

export default OtpVerificationPage;
