import React from "react";
import { useUser } from "../contexts/userContext";
import Navbar from "../components/Navbar";
const Profile = () => {
  const { user } = useUser();
  return (
    <>
      <div className="flex flex-col">
        <div className="">
          <Navbar />
        </div>
        <h1 className="text-center font-bold">Profile</h1>
      </div>
    </>
  );
};
export default Profile;
