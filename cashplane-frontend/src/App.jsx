// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Registration from "./components/Registration";
import Login from "./components/Login";
import Activate from "./components/Activate";
import ReferralStep from "./components/ReferralStep";
import Payment from "./pages/Payment";
import PaymentConfirm from "./pages/PaymentConfirm";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Verify from "./pages/Verify"; // Email verification screen
import AdminDashboard from "./pages/AdminDashboard"; // Admin dashboard

// Admin email(s)
const ADMIN_EMAILS = ["cashplanehq@gmail.com"];

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Listen for auth state changes & fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserData(null);
        setCheckingAuth(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        const data = docSnap.exists() ? docSnap.data() : null;

        setUser(currentUser);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Route guard: blocks unauthenticated users
  const ProtectedRoute = ({ children }) => {
    if (checkingAuth) return <p className="text-center">Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  // Flow control for redirecting users based on activation & verification status
  const FlowControl = () => {
    if (checkingAuth) return <p className="text-center">Loading...</p>;

    if (!user) return <Navigate to="/login" replace />;

    // Admin bypasses activation/payment/referral checks
    if (ADMIN_EMAILS.includes(user.email)) {
      return <Navigate to="/admin" replace />;
    }

    if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

    if (!userData) return <p className="text-center">Loading user data...</p>;

    if (!userData.isActivated) return <Navigate to="/activate" replace />;

    if (!userData.referralCodeConfirmed) return <Navigate to="/referral" replace />;

    return <Navigate to="/dashboard" replace />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white px-4 py-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-gray-100 border border-gray-600 px-4 py-2 rounded-full shadow hover:bg-opacity-70 transition-all duration-300"
      >
        ⬅ Back
      </button>

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold mb-6">🛫 Welcome to CashPlane</h1>
              <p className="text-lg text-center max-w-xl mb-10">
                Play games, earn real cash, and invite friends to fly high with you! Start your hustle journey today.
              </p>
              <div className="w-full max-w-md bg-white text-black p-8 rounded-2xl shadow-2xl space-y-12">
                <Registration />
                <div className="border-t border-gray-300" />
                <Login />
              </div>
            </div>
          }
        />

        {/* Controlled Redirect After Login */}
        <Route path="/auth-flow" element={<FlowControl />} />

        {/* Public Routes */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verify />} />

        {/* Protected User Flow */}
        <Route
          path="/activate"
          element={
            <ProtectedRoute>
              <Activate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <ReferralStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/btc"
          element={
            <ProtectedRoute>
              <PaymentConfirm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/momo"
          element={
            <ProtectedRoute>
              <PaymentConfirm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
