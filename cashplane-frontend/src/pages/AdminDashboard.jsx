// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ADMIN_EMAIL = "cashplanehq@gmail.com";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    paidUsers: 0,
    totalEarnings: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return navigate("/login");
      if (user.email !== ADMIN_EMAIL) {
        toast.error("Access denied: Admin only");
        return navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const paid = allUsers.filter((u) => u.isActivated).length;
        const earnings = paid * 15;

        setStats({
          totalUsers: allUsers.length,
          paidUsers: paid,
          totalEarnings: earnings,
        });

        setUsers(allUsers);
      } catch {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleVerifyEmail = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { emailVerified: true });
      toast.success("Email verified!");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u))
      );
    } catch {
      toast.error("Failed to verify email");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const games = [
    {
      name: "Aviator",
      players: 310,
      payout: 380,
      topPlayer: "user_aviator",
      route: "/games/aviator",
      icon: "https://img.icons8.com/fluency/96/airplane-take-off.png",
    },
    {
      name: "Candy Crush",
      players: 267,
      payout: 420,
      topPlayer: "user_candy",
      route: "/games/candycrush",
      icon: "https://img.icons8.com/emoji/96/candy-emoji.png",
    },
    {
      name: "Flappy Bird",
      players: 223,
      payout: 315,
      topPlayer: "flappy123",
      route: "/games/flappybird",
      icon: "https://img.icons8.com/color/96/bird.png",
    },
    {
      name: "T-Rex Runner",
      players: 191,
      payout: 260,
      topPlayer: "treeman",
      route: "/games/treerunner",
      icon: "https://img.icons8.com/color/96/running.png",
    },
    {
      name: "Snake Game",
      players: 150,
      payout: 300,
      topPlayer: "snakechamp",
      route: "/games/snakegame",
      icon: "https://img.icons8.com/color/96/snake.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-lg text-gray-400">Total Users</p>
          <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-lg text-gray-400">Paid Users</p>
          <h2 className="text-3xl font-bold">{stats.paidUsers}</h2>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-lg text-gray-400">Total Earnings (GH₵)</p>
          <h2 className="text-3xl font-bold">GH₵{stats.totalEarnings}</h2>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-gray-800 p-4 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email Verified</th>
                <th className="px-4 py-3">Activated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700">
                  <td className="px-4 py-2 break-all">{u.id}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.fullname || "-"}</td>
                  <td className="px-4 py-2">{u.emailVerified ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">
                    {u.isActivated ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-red-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!u.emailVerified && (
                      <button
                        onClick={() => handleVerifyEmail(u.id)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Verify Email
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Center */}
      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">🎮 Game Center</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {games.map((game, idx) => (
            <div
              key={idx}
              className="bg-gray-700 p-4 rounded-xl text-center shadow hover:shadow-lg transition"
            >
              <img
                src={game.icon}
                alt={`${game.name} icon`}
                className="w-20 h-20 mx-auto mb-2"
              />
              <h3 className="text-xl font-semibold">{game.name}</h3>
              <p className="text-sm text-gray-400">Players: {game.players}</p>
              <p className="text-sm text-gray-400">Top Player: {game.topPlayer}</p>
              <p className="text-sm text-gray-400 mb-3">
                Payout: GH₵{game.payout}
              </p>
              <button
                onClick={() => navigate(game.route)}
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white font-bold"
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
