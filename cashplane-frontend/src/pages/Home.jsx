import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          🛫 Welcome to <span className="text-yellow-400">CashPlane</span>
        </h1>
        <p className="text-lg text-gray-300">
          Play games, earn real cash, and invite friends to fly high with you! Start your hustle journey today.
        </p>
        <Link
          to="/register"
          className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-full shadow-md hover:bg-yellow-300 transition"
        >
          🚀 Get Started
        </Link>
      </div>
    </div>
  );
}
