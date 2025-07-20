import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser?.emailVerified) {
      toast.error("Please verify your email before proceeding.");
      navigate("/verify");
    }
  }, []);

  const handlePayment = async (method) => {
    setProcessing(true);
    console.log("Payment method:", method, "amount: ₵100");

    // 🛠 Redirect to confirmation screen for BTC or MoMo
    setTimeout(() => {
      navigate(`/payment/${method}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-6 text-center">
        <h2 className="text-2xl font-bold">Make Payment</h2>
        <p className="text-gray-700">Please pay ₵100 to proceed and unlock full access.</p>

        <button
          onClick={() => handlePayment("btc")}
          disabled={processing}
          className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition"
        >
          {processing ? "Processing..." : "Pay with BTC"}
        </button>

        <button
          onClick={() => handlePayment("momo")}
          disabled={processing}
          className="w-full bg-yellow-500 text-black py-3 rounded hover:bg-yellow-600 transition"
        >
          {processing ? "Processing..." : "Pay with MoMo"}
        </button>
      </div>
    </div>
  );
}
