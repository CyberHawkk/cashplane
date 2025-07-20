// src/components/Activate.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// ✅ BTC address and QR code image (place /public/btc-qr.png)
const BTC_ADDRESS = "bc1qvftpl4dv6s2pdlwqk0d7sl2e50607etlnf4nu4";
const BTC_QR_IMAGE = "/btc-qr.png";

export default function Activate() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isPaying, setIsPaying] = useState(false);

  // Back button handler
  const handleBack = () => navigate(-1);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch {
      toast.error("Failed to log out.");
    }
  };

  // User confirms BTC payment manually (set paymentPending)
  const handleBTCConfirm = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        paymentPending: true,
        paymentMethod: "BTC",
      });
      toast.success("BTC payment marked! We'll verify and activate your account.");
      navigate("/enter-referral");
    } catch (error) {
      toast.error("Failed to update payment status.");
      console.error(error);
    }
  };

  // Trigger Paystack MoMo payment
  const handlePaystack = () => {
    setIsPaying(true);
    const handler = window.PaystackPop.setup({
      key: "pk_live_9c716c19c87c7a95c5fbe431ec5a65b38a26336f", // Replace with your live public key
      email: user.email,
      amount: 10000, // ₵100 = 10,000 pesewas
      currency: "GHS",
      label: "CashPlane Activation",
      channels: ["mobile_money"], // MoMo only
      callback: async function (response) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            paymentPending: true,
            paymentMethod: "MoMo",
          });
          toast.success("MoMo payment complete! Verifying...");
          setIsPaying(false);
          navigate("/enter-referral");
        } catch (error) {
          toast.error("Error saving payment status.");
          setIsPaying(false);
        }
      },
      onClose: function () {
        toast.error("Payment window closed.");
        setIsPaying(false);
      },
    });
    handler.openIframe();
  };

  return (
    <div className="p-6 text-white max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg mt-10">
      {/* Back & Logout buttons */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-blue-400 hover:underline"
          aria-label="Back"
        >
          ← Back
        </button>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
          aria-label="Logout"
        >
          Log Out
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">🔐 Activate Your Account</h2>

      {/* BTC Payment Option */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Option 1: Pay with Bitcoin</h3>
        <p className="mb-2">
          Send exactly <strong>₵100 worth of BTC</strong> to the address below:
        </p>
        <img src={BTC_QR_IMAGE} alt="BTC QR Code" className="w-40 h-40 mb-2 mx-auto" />
        <code className="block bg-gray-800 p-2 rounded mb-4 break-all text-center">
          {BTC_ADDRESS}
        </code>
        <button
          onClick={handleBTCConfirm}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded w-full"
        >
          I’ve Paid with BTC
        </button>
      </div>

      <hr className="my-6 border-gray-600" />

      {/* MoMo Payment Option via Paystack */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Option 2: MoMo (Paystack)</h3>
        <p className="mb-2">Instantly pay ₵100 via MTN, Vodafone, or AirtelTigo.</p>
        <button
          onClick={handlePaystack}
          disabled={isPaying}
          className={`w-full py-2 rounded text-white ${
            isPaying ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isPaying ? "Processing..." : "Pay with MoMo (via Paystack)"}
        </button>
      </div>
    </div>
  );
}
