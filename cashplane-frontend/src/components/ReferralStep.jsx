// src/components/ReferralStep.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api"; // 👈 Make sure this points to your axios instance

export default function ReferralStep() {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (!referralCode.trim()) {
      toast.error("Please enter a referral code.");
      return;
    }

    setLoading(true);
    try {
      // ✅ POST to backend validation endpoint
      const res = await api.post("/auth/validate-referral", {
        referralCode,
      });

      toast.success(res.data.message || "✅ Referral validated!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Invalid referral code.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="max-w-md w-full p-8 bg-white text-gray-800 rounded-xl shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center">🎁 Enter Referral Code</h2>
        <p className="text-sm text-center text-gray-600">
          If you received a referral code, enter it below to unlock bonuses.
        </p>

        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleValidate}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded transition-all duration-300"
        >
          {loading ? "Validating..." : "Submit Code"}
        </button>
      </div>
    </div>
  );
}
