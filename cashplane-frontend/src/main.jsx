// src/main.jsx or src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import Verify from "./pages/Verify";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<App />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />

        {/* Duplicate dashboard route in case it's accessed directly */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
