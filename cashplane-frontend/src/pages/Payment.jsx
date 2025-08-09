// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import emailjs from "emailjs-com";
import QRCode from "react-qr-code";

export default function Payment() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(false);

  const btcAddress = "bc1q0cncuzh44j7gac49vhgt9tccq7n6xh3u8j203z";

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

    // BTC Payment flow
    toast.success("BTC Payment option selected.");
    setProcessing(true);

    // Simulate BTC payment confirmation
    setTimeout(() => {
      setProcessing(false);
      toast.success("BTC Payment confirmed (simulated)");
      handlePostPayment();
    }, 5000);
  };

  const handlePostPayment = () => {
    const referralCode = `CPL-${uuidv4().slice(0, 8).toUpperCase()}`;
    sendReferralEmail(user.email, referralCode);

    localStorage.setItem("referralCode", referralCode);
    navigate("/enter-referral");
  };

  const sendReferralEmail = (email, code) => {
    emailjs
      .send(
        "service_0o8j57c",
        "template_mimjbjj",
        {
          to_email: email,
          referral_code: code,
        },
        "bujexVAiBM3FInity"
      )
      .then(() => {
        toast.success("Referral code sent to email!");
      })
      .catch((err) => {
        toast.error("Failed to send email");
        console.error(err);
      });
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(btcAddress).then(() => {
      toast.success("BTC address copied!");
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
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Make Payment</h2>
        <p className="text-gray-600">
          Pay ₵100 worth of BTC to access your dashboard.
        </p>

        {/* BTC Payment Details */}
        <div className="bg-gray-100 p-4 rounded space-y-3">
          <p className="text-sm text-gray-800">
            Send exactly ₵100 worth of BTC to:
          </p>
          <p className="font-mono text-sm text-gray-900 break-all">{btcAddress}</p>

          <button
            onClick={copyAddressToClipboard}
            className="text-sm text-blue-600 hover:underline"
          >
            Copy BTC Address
          </button>

          <div className="mt-4 flex justify-center">
            <QRCode value={btcAddress} size={128} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            After sending, click “Confirm BTC Payment” below to continue.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {processing ? "Processing..." : "Confirm BTC Payment"}
        </button>
      </div>
    </div>
  );
}
