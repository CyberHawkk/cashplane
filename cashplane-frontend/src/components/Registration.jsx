import React, { useState } from "react";
import { auth, db, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

const logoSrc = "/cashplane-logo.png";

export default function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(user, { displayName: form.fullname });
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: form.fullname,
        email: user.email,
        method: "email",
        emailVerified: false,
      });

      toast.success("Verification email sent. Check your inbox.");
      navigate("/verify");
    } catch (err) {
      console.error("Email signup error:", err.message);
      toast.error("Signup failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: user.displayName,
        email: user.email,
        method: "google",
        emailVerified: user.emailVerified,
      });

      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-In error:", err.message);
      toast.error("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-4">
      <form
        onSubmit={handleEmailSignup}
        className="bg-white/10 backdrop-blur-md text-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5 border border-white/20"
      >
        <div className="flex justify-center">
          {!logoError ? (
            <div className="h-24 w-24 rounded-full bg-white/10 border border-blue-400 p-1 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <img
                src={logoSrc}
                alt="CashPlane Logo"
                className="h-20 w-20 object-contain rounded-full"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic text-center">
              Logo not found. Place it in <code>/public</code> as{" "}
              <strong>cashplane-logo.png</strong>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-center mb-2">
          🚀 Join <span className="text-blue-400">CashPlane</span>
        </h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.fullname}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full p-3 pr-10 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div
            className="absolute right-3 top-3.5 cursor-pointer text-gray-300 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
        >
          {loading ? "Registering..." : "✅ Register with Email"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-500" />
          <span className="mx-3 text-gray-300 text-sm">or</span>
          <hr className="flex-grow border-gray-500" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-white text-gray-800 font-medium py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-200"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign up with Google
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline transition"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
