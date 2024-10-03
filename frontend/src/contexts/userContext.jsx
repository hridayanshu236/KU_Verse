import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Generate a random user ID between 1 and 50
  const getRandomUserId = () => {
    return Math.floor(Math.random() * 50) + 1; // Random number between 1 and 50
  };

  const fetchUserDetails = async () => {
    const randomUserId = getRandomUserId(); // Get random ID
    try {
      const response = await axios.get(
        `https://66fe1418699369308956f9f6.mockapi.io/api/users/${randomUserId}`
      );
      setUser(response.data);
      console.log("User data fetched successfully", response.data);
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details on component mount
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  return useContext(UserContext);
};
