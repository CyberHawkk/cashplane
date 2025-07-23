import React from "react";

export default function MomoSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-700">🎉 Payment Successful!</h2>
        <p className="mt-2 text-gray-700">Thank you for joining KwikLoom. Your account has been unlocked.</p>
      </div>
    </div>
  );
}
