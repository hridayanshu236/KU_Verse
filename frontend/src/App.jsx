import React from "react";
import { Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
import Posts from "./Components/Posts";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Settings from "./pages/Settings";
function App() {
  return (
    <>
      <Routes>
        <Route path="/chats" element={<Chats />} />
        <Route
          path="/posts"
          element={<Posts textOnly={false} captionPresent={true} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
