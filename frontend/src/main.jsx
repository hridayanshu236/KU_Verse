import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/userContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

        <UserProvider>
          <App />
        </UserProvider>

    </BrowserRouter>
  </StrictMode>
);
