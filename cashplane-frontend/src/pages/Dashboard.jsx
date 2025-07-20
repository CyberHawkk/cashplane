// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Game components
import FlappyBird from "../games/FlappyBird";
import TRexRunner from "../games/TRexRunner";
import CandyCrush from "../games/CandyCrush";
import Aviator from "../games/Aviator";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          // Check if user is activated and payment is confirmed
          if (data.activated === true && data.paymentConfirmed === true) {
            // Subscribe to realtime updates after passing checks
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                const updatedData = docSnap.data();
                setUserData({ ...updatedData, uid: user.uid });
                setBalance(updatedData.balance || 0);
                setReferralCode(updatedData.referralCode || "");
              }
            });

            return () => unsubscribe();
          } else {
            // Not activated or payment pending → redirect to /activate
            navigate("/activate");
          }
        } else {
          toast.error("User data not found.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Error fetching user data.");
        navigate("/login");
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  const handleCopyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${referralCode || userData?.uid}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case "flappy":
        return <FlappyBird />;
      case "trex":
        return <TRexRunner />;
      case "candy":
        return <CandyCrush />;
      case "aviator":
        return <Aviator />;
      default:
        return null;
    }
  };

  if (!userData) return <div className="text-center p-6">Loading dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold">🚀 Welcome back, {userData.fullname || "Player"}!</h1>

      {/* USER INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold">User ID:</p>
          <p className="text-sm break-all">{userData.uid}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold">Referral Code:</p>
          <p className="text-sm">{referralCode}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold">Referral Earnings:</p>
          <p className="text-lg font-bold text-green-600">₵{balance.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold">Profile Completion:</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div className="bg-blue-500 h-3 rounded-full w-[60%]"></div>
          </div>
          <p className="text-xs mt-1">60% Complete</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2">
        <button
          onClick={handleCopyReferralLink}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
        >
          🔗 Copy My Referral Link
        </button>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
        >
          🔓 Sign Out
        </button>
      </div>

      {/* GAME OPTIONS */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-center">🎮 Play & Earn Games</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedGame("flappy")}
            className="bg-blue-100 hover:bg-blue-300 text-blue-900 font-semibold py-2 rounded-lg shadow"
          >
            🐤 Flappy Bird
          </button>
          <button
            onClick={() => setSelectedGame("trex")}
            className="bg-green-100 hover:bg-green-300 text-green-900 font-semibold py-2 rounded-lg shadow"
          >
            🦖 T-Rex Runner
          </button>
          <button
            onClick={() => setSelectedGame("candy")}
            className="bg-pink-100 hover:bg-pink-300 text-pink-900 font-semibold py-2 rounded-lg shadow"
          >
            🍬 Candy Crush
          </button>
          <button
            onClick={() => setSelectedGame("aviator")}
            className="bg-purple-100 hover:bg-purple-300 text-purple-900 font-semibold py-2 rounded-lg shadow"
          >
            ✈️ Aviator
          </button>
        </div>

        <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow-inner">
          {selectedGame ? (
            renderSelectedGame()
          ) : (
            <p className="text-center text-gray-600">Select a game to play!</p>
          )}
        </div>
      </div>

      {/* EXTRAS */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">🔔 Notifications</h2>
        <p className="text-sm text-gray-600">No new notifications yet.</p>

        <h2 className="text-xl font-semibold">🏆 Leaderboard</h2>
        <p className="text-sm text-gray-600">Coming soon…</p>

        <Link
          to="/games"
          className="text-blue-500 hover:underline text-sm block text-center mt-4"
        >
          🎮 View All Games
        </Link>
      </div>
    </div>
  );
}
