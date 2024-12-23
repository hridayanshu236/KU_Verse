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
import StoryCard from "./Components/StoryCard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Feed />} path="/feed" />
          <Route element={<Chats />} path="/chats" />
          <Route element={<Chats />} path="/chats/:chatId" />
          <Route
            path="/posts"
            element={<Posts textOnly={false} captionPresent={true} />}
          />
          <Route element={<Profile />} path="/profile" />
          <Route element={<Profile />} path="/profile/:id" />
          <Route element={<Settings />} path="/settings" />
        </Route>
        <Route element={<PublicRoute />}>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<SignupPage />} path="/signup" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
