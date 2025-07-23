// src/components/Activate.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

export default function Activate() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  // Automatically redirect if already verified
  useEffect(() => {
    if (user?.emailVerified) {
      toast.success("Email already verified!");
      navigate("/payment");
    }
  }, [user, navigate]);

  // Manual check if user has verified email
  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;

      if (refreshedUser.emailVerified) {
        toast.success("Email verified successfully!");
        navigate("/payment");
      } else {
        toast.error("Your email is still not verified.");
      }
    } catch (error) {
      toast.error("Error checking verification status.");
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  // Optional: Resend verification email
  const handleResendEmail = async () => {
    setResending(true);
    try {
      await auth.currentUser.sendEmailVerification();
      toast.success("Verification email resent!");
    } catch (error) {
      toast.error("Failed to resend email.");
      console.error(error);
    } finally {
      setResending(false);
    }
  };

  // Show loading screen while auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // If no user, prompt to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">No user found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600">
          A verification email was sent to <strong>{user.email}</strong>. <br />
          Please click the link in your inbox to verify.
        </p>

        <button
          onClick={handleCheckVerification}
          disabled={checking}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {checking ? "Checking..." : "I've Verified My Email"}
        </button>

        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
        >
          {resending ? "Resending..." : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}
