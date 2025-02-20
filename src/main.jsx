import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";

const user = {
  name: "Raisul Kayes Raka",
  email: "test@example.com",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user?.email ? <App /> : <h1>Auth</h1>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
