import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      toast.success(res.data.message || "🎉 Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      toast.error(msg);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
      });

      await api.post("/auth/google-login", { token: idToken });

      toast.success("🎉 Logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("❌ Google login failed.");
    }
  };

  const handlePasswordReset = async () => {
    if (!form.email) {
      toast.error("Please enter your email to reset password.");
      return;
    }

    try {
      setResetting(true);
      await sendPasswordResetEmail(auth, form.email);
      toast.success("📩 Password reset email sent!");
    } catch (error) {
      toast.error("❌ Failed to send reset email. " + error.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">
        🔐 Login to CashPlane
      </h2>

      <form onSubmit={handleLogin} className="space-y-4 text-gray-900">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-4 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>

        <div className="flex justify-between text-sm mt-1">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-blue-500 hover:underline"
            disabled={resetting}
          >
            {resetting ? "Sending..." : "Forgot password?"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
        >
          ✅ Login
        </button>
      </form>

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 font-medium">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full border py-2 rounded flex items-center justify-center space-x-2 hover:bg-gray-100 transition duration-200 text-gray-800"
      >
        <FcGoogle size={20} />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
