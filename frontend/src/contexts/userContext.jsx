import { useContext, createContext, useState, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/myprofile",
        {
          withCredentials: true, 
        }
      );
      setUser(response.data);
      console.log("User data fetched successfully", response.data);
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  }, []); // Empty dependency array means it won't change

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
