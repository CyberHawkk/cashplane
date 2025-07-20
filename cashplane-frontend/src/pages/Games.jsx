// src/pages/Games.jsx
import React from "react";
import { Link } from "react-router-dom";

const games = [
  {
    title: "Candy Crush",
    path: "/games/candy-crush",
    image: "https://cdn-icons-png.flaticon.com/512/3176/3176362.png",
    description: "Match candies and beat levels!",
  },
  {
    title: "Coming Soon",
    path: "#",
    image: "https://cdn-icons-png.flaticon.com/512/4807/4807695.png",
    description: "More fun games coming soon!",
    comingSoon: true,
  },
];

export default function Games() {
  return (
    <div className="section-container text-white">
      <h1 className="text-4xl font-bold mb-8 text-center neon-glow">🎮 Games</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game, idx) => (
          <div
            key={idx}
            className="card flex flex-col items-center justify-between hover:scale-105 transition"
          >
            <img src={game.image} alt={game.title} className="w-20 mb-4" />
            <h2 className="text-xl font-semibold">{game.title}</h2>
            <p className="text-sm text-gray-300 text-center my-2">
              {game.description}
            </p>
            {!game.comingSoon ? (
              <Link
                to={game.path}
                className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Play Now
              </Link>
            ) : (
              <span className="mt-3 inline-block px-4 py-2 bg-gray-500 text-white rounded-lg opacity-60 cursor-not-allowed">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
