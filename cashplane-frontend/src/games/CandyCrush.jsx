import React, { useEffect, useState } from "react";
import "../index.css";

const width = 8;

const candyImages = {
  strawberry: "https://img.icons8.com/color/96/strawberry.png",
  banana: "https://img.icons8.com/color/96/banana.png",
  apple: "https://img.icons8.com/color/96/apple.png",
  orange: "https://img.icons8.com/color/96/orange.png",
  grapes: "https://img.icons8.com/color/96/grapes.png",
  watermelon: "https://img.icons8.com/color/96/watermelon.png",
};

const candyColors = Object.keys(candyImages);

const CandyCrush = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [lives, setLives] = useState(5);
  const [shopOpen, setShopOpen] = useState(false);
  const [movesLeft, setMovesLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("waiting");
  const [matchedIndices, setMatchedIndices] = useState([]);
  const goalScore = 300;

  const checkForRowOfThree = (board) => {
    let matchFound = false;
    const notValid = [
      6, 7, 14, 15, 22, 23, 30, 31,
      38, 39, 46, 47, 54, 55, 62, 63,
    ];

    for (let i = 0; i < 64; i++) {
      if (notValid.includes(i)) continue;
      const row = [i, i + 1, i + 2];
      const decidedColor = board[i];
      if (decidedColor && row.every((idx) => board[idx] === decidedColor)) {
        row.forEach((idx) => (board[idx] = ""));
        setScore((prev) => prev + 30);
        setMatchedIndices(row);
        matchFound = true;
      }
    }
    return matchFound;
  };

  const checkForColumnOfThree = (board) => {
    let matchFound = false;
    for (let i = 0; i <= 39; i++) {
      const column = [i, i + width, i + width * 2];
      const decidedColor = board[i];
      if (decidedColor && column.every((idx) => board[idx] === decidedColor)) {
        column.forEach((idx) => (board[idx] = ""));
        setScore((prev) => prev + 30);
        setMatchedIndices(column);
        matchFound = true;
      }
    }
    return matchFound;
  };

  const moveFruitsDown = (board) => {
    for (let i = 55; i >= 0; i--) {
      if (board[i + width] === "") {
        board[i + width] = board[i];
        board[i] = "";
      }
    }

    for (let i = 0; i < width; i++) {
      if (board[i] === "") {
        board[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
      }
    }
  };

  const dragStart = (e) => setSquareBeingDragged(e.target);
  const dragDrop = (e) => setSquareBeingReplaced(e.target);

  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced || lives <= 0 || movesLeft <= 0 || gameState !== "waiting") return;

    const draggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const replacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    const board = [...currentColorArrangement];
    const validMoves = [draggedId - 1, draggedId + 1, draggedId - width, draggedId + width];

    if (!validMoves.includes(replacedId)) return;

    const draggedColor = board[draggedId];
    const replacedColor = board[replacedId];

    board[draggedId] = replacedColor;
    board[replacedId] = draggedColor;

    const match = checkForColumnOfThree([...board]) || checkForRowOfThree([...board]);

    if (match) {
      setCurrentColorArrangement(board);
    } else {
      board[draggedId] = draggedColor;
      board[replacedId] = replacedColor;
      setCurrentColorArrangement(board);
    }

    setLives((prev) => Math.max(0, prev - 1));
    setMovesLeft((prev) => prev - 1);
    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);
  };

  useEffect(() => {
    const randomColors = Array.from({ length: width * width }, () =>
      candyColors[Math.floor(Math.random() * candyColors.length)]
    );
    setCurrentColorArrangement(randomColors);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState === "game-over" || gameState === "win") return;

      const board = [...currentColorArrangement];
      const matched = checkForColumnOfThree(board) | checkForRowOfThree(board);

      if (matched) {
        setCurrentColorArrangement([...board]);
        setTimeout(() => {
          moveFruitsDown(board);
          setMatchedIndices([]);
          setCurrentColorArrangement([...board]);
        }, 300);
      } else {
        moveFruitsDown(board);
        setCurrentColorArrangement([...board]);
      }

      if (movesLeft <= 0 || lives <= 0) {
        setGameState("game-over");
      } else if (score >= goalScore) {
        setGameState("win");
      }
    }, 400);

    return () => clearInterval(timer);
  }, [currentColorArrangement, movesLeft, lives, score, gameState]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 animate-bounce">🍓🍌 Fruit Crush</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm sm:text-base">
        <span>❤️ Lives: <span className="text-red-400 font-bold">{lives}</span></span>
        <span>🎯 Goal: {goalScore}</span>
        <span>⭐ Score: <span className="text-yellow-300 font-bold">{score}</span></span>
        <span>🎮 Moves: <span className="text-blue-400 font-bold">{movesLeft}</span></span>
        <button
          className="bg-green-600 hover:bg-green-700 rounded-full w-8 h-8 text-white font-bold text-xl"
          onClick={() => setShopOpen(true)}
          title="Open Shop"
        >+
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1 w-[320px] h-[320px]">
        {currentColorArrangement.map((fruitColor, index) => (
          <img
            key={index}
            data-id={index}
            src={candyImages[fruitColor]}
            alt={fruitColor}
            draggable={lives > 0 && movesLeft > 0 && gameState === "waiting"}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            className={`w-10 h-10 object-contain rounded-md bg-white shadow-md transition-transform duration-300 ease-in-out ${
              matchedIndices.includes(index) ? "scale-125 opacity-50" : ""
            } ${lives === 0 || movesLeft <= 0 ? "opacity-40 grayscale" : ""}`}
          />
        ))}
      </div>

      {gameState === "game-over" && (
        <p className="mt-6 text-red-400 font-bold text-lg">💀 Game Over! Try again!</p>
      )}
      {gameState === "win" && (
        <p className="mt-6 text-green-400 font-bold text-lg">🎉 You Win! Congratulations!</p>
      )}

      <div className="mt-6 max-w-md text-center text-white text-sm sm:text-base">
        <h2 className="text-lg font-semibold mb-2">🕹️ How to Play</h2>
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Swap adjacent fruits by dragging them.</li>
          <li>Match 3+ of the same fruits in a row or column.</li>
          <li>Clear 300 points before you run out of moves (20) or lives (5).</li>
        </ul>
      </div>

      {shopOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 shadow-lg w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-red-600"
              onClick={() => setShopOpen(false)}
            >✕</button>
            <h2 className="text-xl font-bold mb-4 text-center">🛍️ Fruit Shop</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>🔁 Extra Swap</span>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">Buy</button>
              </li>
              <li className="flex justify-between items-center">
                <span>💣 Blast Row</span>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">Buy</button>
              </li>
              <li className="flex justify-between items-center">
                <span>🕒 Extra Life</span>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => {
                    setLives((prev) => prev + 1);
                    setShopOpen(false);
                  }}
                >Buy</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandyCrush;
