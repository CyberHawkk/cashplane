import React, { useState, useEffect, useRef } from "react";
import "./aviator.css"; // custom styles for plane animation

export default function Aviator() {
  const [balance, setBalance] = useState(500); // ₵500 default
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [crashed, setCrashed] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [autoCashout, setAutoCashout] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const crashThresholdRef = useRef(null); // Store crash threshold for current flight

  useEffect(() => {
    if (isFlying) {
      intervalRef.current = setInterval(() => {
        setMultiplier((prev) => {
          const newMultiplier = parseFloat((prev + 0.01).toFixed(2));
          // Use fixed crash threshold generated once per flight
          if (newMultiplier > crashThresholdRef.current) {
            clearInterval(intervalRef.current);
            crashPlane(newMultiplier);
            return prev; // stop multiplier from increasing after crash
          }
          if (autoCashout && newMultiplier >= 2) {
            cashOut(newMultiplier);
            clearInterval(intervalRef.current);
            return newMultiplier;
          }
          return newMultiplier;
        });
      }, 100);
    }
    return () => clearInterval(intervalRef.current);
  }, [isFlying, autoCashout]);

  const startFlight = () => {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) return alert("Invalid bet!");
    
    // Generate one fixed crash threshold per flight, between 1.0 and 10.0
    crashThresholdRef.current = 1 + Math.random() * 9;

    setBalance((prev) => prev - bet);
    setMultiplier(1);
    setCrashed(false);
    setIsFlying(true);
  };

  const cashOut = (currentMultiplier = multiplier) => {
    const payout = parseFloat((betAmount * currentMultiplier).toFixed(2));
    setBalance((prev) => prev + payout);
    endFlight(true, payout);
  };

  const crashPlane = (finalMultiplier) => {
    setCrashed(true);
    setIsFlying(false);
    setHistory((prev) => [finalMultiplier.toFixed(2), ...prev.slice(0, 9)]);
  };

  const endFlight = (cashedOut = false, payout = 0) => {
    setIsFlying(false);
    setCrashed(!cashedOut);
    setMultiplier(1);
    setBetAmount("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-6 bg-gray-900 text-white rounded-xl shadow-lg min-h-screen">
      <h1 className="text-4xl font-bold mb-2">✈️ Aviator Game</h1>

      <div className="text-lg">💰 Balance: ₵{balance.toFixed(2)}</div>

      <div className="flex justify-center items-center gap-3 mt-4">
        <input
          type="number"
          placeholder="Enter Bet (₵)"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          disabled={isFlying}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-40"
          min="0"
          step="0.01"
        />
        <button
          onClick={startFlight}
          disabled={isFlying}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded disabled:opacity-50"
        >
          Start Flight
        </button>
      </div>

      <div className="mt-6 text-6xl font-mono h-20">
        {crashed ? "💥 Crashed!" : `🚀 x${multiplier.toFixed(2)}`}
      </div>

      {isFlying && !crashed && (
        <button
          onClick={() => cashOut()}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded font-semibold text-black"
        >
          Cash Out!
        </button>
      )}

      {/* Plane Animation */}
      <div className="relative h-40 overflow-hidden border rounded-lg bg-black mx-auto max-w-md mt-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3069/3069171.png"
          alt="Plane"
          className={`w-16 absolute z-10 top-1/2 transform -translate-y-1/2 ${
            isFlying && !crashed ? "animate-flight" : ""
          }`}
          style={{ left: isFlying ? "0" : "-100px" }}
        />
      </div>

      <div className="mt-6 text-left max-w-md mx-auto">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoCashout}
            onChange={() => setAutoCashout(!autoCashout)}
            disabled={isFlying}
            className="form-checkbox h-5 w-5 text-yellow-400"
          />
          <span className="text-white font-medium">Auto Cashout (at 2x)</span>
        </label>
      </div>

      <div className="mt-8 max-w-md mx-auto text-left">
        <h2 className="text-xl font-semibold mb-3">📊 Crash History</h2>
        <div className="flex flex-wrap justify-start gap-2">
          {history.length === 0 && (
            <p className="text-gray-400 italic">No crashes yet</p>
          )}
          {history.map((h, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-700 rounded text-sm font-mono"
            >
              x{h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
