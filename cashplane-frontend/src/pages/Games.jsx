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
    title: "Aviator",
    path: "/games/aviator",
    image: "https://cdn-icons-png.flaticon.com/512/3069/3069171.png",
    description: "Fly the plane and cash out before it crashes!",
  },
  {
    title: "Snake",
    path: "/games/snake",
    image: "https://cdn-icons-png.flaticon.com/512/1132/1132674.png",
    description: "Eat food, grow longer, and survive!",
  },
  {
    title: "T-Rex Runner",
    path: "/games/trex",
    image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    description: "Jump over cacti and run endlessly!",
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
    <div className="section-container text-white px-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center neon-glow">
        🎮 Games
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map((game, idx) => (
          <div
            key={idx}
            className="card flex flex-col items-center justify-between rounded-lg bg-gray-800 p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
          >
            <img src={game.image} alt={game.title} className="w-20 mb-4" />
            <h2 className="text-xl font-semibold">{game.title}</h2>
            <p className="text-sm text-gray-300 text-center my-2">
              {game.description}
            </p>
            {!game.comingSoon ? (
              <Link
                to={game.path}
                className="mt-3 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold neon-glow-button transition"
              >
                Play Now
              </Link>
            ) : (
              <span className="mt-3 inline-block px-6 py-2 bg-gray-600 text-white rounded-lg opacity-60 cursor-not-allowed">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
