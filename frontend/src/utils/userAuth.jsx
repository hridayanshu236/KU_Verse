import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchUserProfile, fetchFriendList } from "../utils/userServices"; // Adjust path as necessary

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);

        const friendList = await fetchFriendList();
        setFriends(friendList);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, friends, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUserContext = () => useContext(UserContext);

export default UserContext;
