// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    // Only allow admin email
    if (user.email !== "youradminemail@example.com") {
      toast.error("Access denied: Admins only");
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(allUsers);
      } catch {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  const handleVerifyEmail = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        emailVerified: true,
      });
      toast.success("Email verified!");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u))
      );
    } catch {
      toast.error("Failed to verify email.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">User ID</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Full Name</th>
            <th className="border border-gray-300 p-2">Email Verified</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="border border-gray-300 p-2 break-all">{u.id}</td>
              <td className="border border-gray-300 p-2">{u.email}</td>
              <td className="border border-gray-300 p-2">{u.fullname || "-"}</td>
              <td className="border border-gray-300 p-2">
                {u.emailVerified ? (
                  <span className="text-green-600 font-semibold">✅</span>
                ) : (
                  <span className="text-red-600 font-semibold">❌</span>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {!u.emailVerified && (
                  <button
                    onClick={() => handleVerifyEmail(u.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
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
  );
}
