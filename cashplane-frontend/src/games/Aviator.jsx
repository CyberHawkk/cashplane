// src/pages/games/Aviator.jsx
import React from "react";

export default function Aviator() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">✈️ Aviator Game</h1>
      <iframe
        title="Aviator"
        src="https://aviator-online.com/demo"
        width="100%"
        height="600px"
        frameBorder="0"
        className="rounded-lg"
      ></iframe>
    </div>
  );
}
