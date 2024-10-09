import React from "react";
import { Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
import Posts from "./Components/Posts";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Settings from "./pages/Settings";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PublicRoute from "./utils/PublicRoute";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Feed />} path="/feed" />
          <Route element={<Chats />} path="/chats" />
          <Route element={<Posts />} path="/posts" />
          <Route element={<Profile />} path="/profile" />
          <Route element={<Settings />} path="/settings" />
        </Route>
        <Route element={<PublicRoute />}>
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
