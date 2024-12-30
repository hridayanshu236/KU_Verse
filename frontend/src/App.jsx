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
import LandingPage from "./pages/LandingPage";
import SavedPosts from "./Components/SavedPosts"; // Correct import

import Events from "./pages/Event";
import EventDetails from "./pages/EventDetail";
 import OtpVerificationPage from "./pages/OtpVerificationPage";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Feed />} path="/feed" />
          <Route element={<Chats />} path="/chats" />
          <Route element={<Chats />} path="/chats/:chatId" />
          <Route element={<Events />} path="/events" />
          <Route element={<EventDetails />} path="/events/:eventId" />
          <Route
            path="/posts"
            element={<Posts textOnly={false} captionPresent={true} />}
          />
          <Route element={<Posts />} path="/posts" />
          <Route element={<Profile />} path="/profile" />
          <Route element={<Profile />} path="/profile/:id" />
          <Route element={<Settings />} path="/settings" />
          <Route element={<SavedPosts />} path="/saved-posts" />{" "}
        </Route>
        <Route element={<PublicRoute />}>
          <Route element={<LandingPage />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<SignupPage />} path="/signup" />
          {<Route element={<OtpVerificationPage />} path="/otp-verification" /> }
        </Route>
      </Routes>
    </>
  );
}

export default App;
