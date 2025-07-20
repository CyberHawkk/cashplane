// src/pages/games/TRexRunner.jsx
import React, { useEffect } from "react";

export default function TRexRunner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/wayou/t-rex-runner/runner.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">🦖 T-Rex Runner</h1>
      <iframe
        title="T-Rex Runner"
        src="https://elgoog.im/t-rex/"
        width="100%"
        height="500px"
        frameBorder="0"
        className="rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
}
