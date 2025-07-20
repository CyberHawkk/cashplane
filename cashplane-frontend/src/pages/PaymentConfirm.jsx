import React from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-hot-toast";

const WALLET_ADDRESS = "bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8";

export default function PaymentConfirm() {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    toast.success("✅ Payment confirmation received.");
    navigate("/referral");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">💸 Confirm Your ₵100 Payment</h2>
      <p className="text-gray-600 text-center">Send ₵100 worth of BTC to the address below:</p>

      <div className="bg-gray-100 p-4 rounded text-center">
        <p className="font-mono text-sm text-gray-700 break-words">{WALLET_ADDRESS}</p>
      </div>

      <div className="flex justify-center">
        <QRCode value={WALLET_ADDRESS} size={160} />
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        ✅ I've Sent the Payment
      </button>
    </div>
  );
}
