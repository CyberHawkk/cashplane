import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(true);

  const checkVerification = async () => {
    if (!auth.currentUser) {
      toast.error("User not found. Please log in again.");
      navigate("/login");
      return;
    }

    setChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        toast.success("✅ Email verified!");
        navigate("/dashboard");
      } else {
        toast.error("❌ Email not verified yet.");
      }
    } catch (error) {
      console.error("Verification check error:", error);
      toast.error("Something went wrong.");
    } finally {
      setChecking(false);
    }
  };

  const resendVerification = async () => {
    if (!auth.currentUser) {
      toast.error("User not found. Please log in again.");
      return;
    }

    setResending(true);
    setCanResend(false);

    try {
      await auth.currentUser.sendEmailVerification();
      toast.success("📬 Verification email resent!");
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend verification email.");
    } finally {
      setResending(false);
      setTimeout(() => setCanResend(true), 60000); // 60 sec delay
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-xl shadow-xl space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-bold">📩 Verify Your Email</h2>
        <p className="text-gray-600">
          A verification link has been sent to your email address.
        </p>
        <p className="text-gray-500 text-sm">
          Click the link in your inbox, then come back here and continue.
        </p>

        <button
          onClick={checkVerification}
          disabled={checking}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          {checking ? "Checking..." : "I've Verified My Email"}
        </button>

        <div className="mt-4">
          <button
            onClick={resendVerification}
            disabled={!canResend || resending}
            className={`py-2 px-6 rounded transition ${
              canResend
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {resending ? "Resending..." : "Resend Verification Email"}
          </button>
          {!canResend && (
            <p className="text-xs text-gray-400 mt-1">
              You can resend again in a minute.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
