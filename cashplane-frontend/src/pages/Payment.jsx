// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import emailjs from "emailjs-com";

export default function Payment() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) {
      toast.error("You must verify your email first.");
      navigate("/activate");
    }
  }, [user, loading, navigate]);

  const handlePayment = () => {
    if (!user?.email) {
      toast.error("Login required");
      return;
    }

    const paystack = window.PaystackPop.setup({
      key: "pk_live_9c716c19c87c7a95c5fbe431ec5a65b38a26336f", // ✅ your live key
      email: user.email,
      amount: 10000, // ₵100 = 10000 pesewas
      currency: "GHS",
      label: "CashPlane Payment",
      channels: ["mobile_money", "card"],
      callback: function (response) {
        toast.success("Payment successful!");

        const referralCode = uuidv4().slice(0, 8).toUpperCase();

        sendReferralEmail(user.email, referralCode);

        // (Optional) Save to Firestore/backend here

        localStorage.setItem("referralCode", referralCode);
        navigate("/enter-referral");
      },
      onClose: function () {
        toast.error("Payment cancelled");
      },
    });

    paystack.openIframe();
  };

  const sendReferralEmail = (email, code) => {
    emailjs
      .send(
        "service_id", // Replace with your EmailJS Service ID
        "template_id", // Replace with your EmailJS Template ID
        {
          to_email: email,
          referral_code: code,
        },
        "user_xxxxxxxxx" // Replace with your EmailJS User ID
      )
      .then(() => {
        toast.success("Referral code sent to email!");
      })
      .catch((err) => {
        toast.error("Failed to send email");
        console.error(err);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">Make Payment</h2>
        <p className="text-gray-600">
          Pay ₵100 via MoMo to access your dashboard.
        </p>
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {processing ? "Processing..." : "Pay ₵100 Now (MoMo)"}
        </button>
      </div>
    </div>
  );
}
