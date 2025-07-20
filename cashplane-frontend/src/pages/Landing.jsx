import React from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">🛫 Welcome to CashPlane</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        Play games, earn real cash, and invite friends to fly high with you! Start your hustle journey today.
      </p>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl">
        <RegisterForm />
        <div className="border-t border-gray-600 my-6"></div>
        <LoginForm />
      </div>
    </div>
  );
}
