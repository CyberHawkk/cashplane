// src/pages/games/FlappyBird.jsx
import React, { useState, useEffect } from "react";

export default function FlappyBird() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      window.open("https://flappybird.io", "_blank"); // Open in new tab
    }
  }, [started]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">🐤 Flappy Bird</h1>
        <p className="mb-6 text-sm text-gray-300">
          Tap the button below to launch the game in a new tab.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition duration-200"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
