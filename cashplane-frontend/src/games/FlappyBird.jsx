// src/pages/games/FlappyBird.jsx
import React, { useState, useEffect } from "react";

export default function FlappyBird() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      window.location.href = "https://flappybird.io"; // Can be embedded with iframe if needed
    }
  }, [started]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🐤 Flappy Bird</h1>
      <button
        onClick={() => setStarted(true)}
        className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-semibold"
      >
        Start Game
      </button>
    </div>
  );
}
