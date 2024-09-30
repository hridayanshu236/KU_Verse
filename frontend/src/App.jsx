import React from 'react'
import { Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
function App() {

  return (
    <>
      <Routes>
        <Route path="/chats" element={<Chats />} />

      </Routes>
    </>
  );               
}

export default App
