// src/components/GameSelector.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  { name: "Flappy Bird", path: "/game/flappy" },
  { name: "T-Rex Runner", path: "/game/trex" },
  { name: "Candy Crush", path: "/game/candy" },
  { name: "Aviator", path: "/game/aviator" },
];

export default function GameSelector() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {games.map((game) => (
        <button
          key={game.path}
          onClick={() => navigate(game.path)}
          className="bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:bg-green-600 transition"
        >
          {game.name}
        </button>
      ))}
    </div>
  );
}
