// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const ADMIN_EMAIL = "cashplanehq@gmail.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = result.user;

      toast.success("Login successful!");
      if (user.email === ADMIN_EMAIL) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Email login failed:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        toast.success("Welcome Admin!");
        navigate("/admin-dashboard");
      } else {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!form.email) return toast.error("Enter your email to reset password");
    setResetting(true);
    try {
      await sendPasswordResetEmail(auth, form.email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to send reset email");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-3 -left-3 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          title="Go Back"
        >
          <IoArrowBack size={18} />
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-300">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetting}
              className="hover:underline"
            >
              {resetting ? "Sending..." : "Forgot Password?"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            {loading ? "Logging in..." : "Sign in with Email"}
          </button>
        </form>

        <div className="my-6 border-t border-gray-600"></div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold"
        >
          {loading ? "Please wait..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
