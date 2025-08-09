import React, { useEffect, useState } from "react";
import "../index.css";

const width = 8;
const candyColors = [
  "strawberry",
  "banana",
  "apple",
  "orange",
  "grapes",
  "watermelon",
];

const candyImages = {
  strawberry: "https://img.icons8.com/color/96/strawberry.png",
  banana: "https://img.icons8.com/color/96/banana.png",
  apple: "https://img.icons8.com/color/96/apple.png",
  orange: "https://img.icons8.com/color/96/orange.png",
  grapes: "https://img.icons8.com/color/96/grapes.png",
  watermelon: "https://img.icons8.com/color/96/watermelon.png",
};

const levelConfig = [
  { goalScore: 300, moves: 20, lives: 5 },
  { goalScore: 500, moves: 18, lives: 4 },
  { goalScore: 800, moves: 15, lives: 4 },
  { goalScore: 1100, moves: 13, lives: 3 },
  { goalScore: 1400, moves: 12, lives: 3 },
];

const dailyTreatOptions = [
  {
    label: "Extra Life ❤️",
    apply: (setLives) => setLives((l) => l + 1),
  },
  {
    label: "Extra Moves 🎮",
    apply: (setMovesLeft) => setMovesLeft((m) => m + 5),
  },
  {
    label: "Score Boost ⭐",
    apply: (setScore) => setScore((s) => s + 50),
  },
];

const SCORE_PER_CANDY = 15;

export default function CandyCrush() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const [lives, setLives] = useState(5);
  const [movesLeft, setMovesLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [goalScore, setGoalScore] = useState(levelConfig[0].goalScore);
  const [gameState, setGameState] = useState("waiting"); // waiting, game-over, level-up, win
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [claimedLevels, setClaimedLevels] = useState([]);

  const [dailyTreatAvailable, setDailyTreatAvailable] = useState(false);
  const [dailyTreatMessage, setDailyTreatMessage] = useState("");

  useEffect(() => {
    const lastClaim = localStorage.getItem("dailyTreatClaimDate");
    const today = new Date().toDateString();

    if (lastClaim !== today) {
      setDailyTreatAvailable(true);
    }
  }, []);

  // Helper: Check row of 3 matches
  const checkForRowOfThree = (board) => {
    const notValid = [
      6, 7, 14, 15, 22, 23, 30, 31,
      38, 39, 46, 47, 54, 55, 62, 63,
    ];
    let matches = [];

    for (let i = 0; i < 64; i++) {
      if (notValid.includes(i)) continue;
      const row = [i, i + 1, i + 2];
      const color = board[i];
      if (
        color &&
        row.every((idx) => board[idx] === color)
      ) {
        matches = matches.concat(row);
      }
    }
    return [...new Set(matches)];
  };

  // Helper: Check column of 3 matches
  const checkForColumnOfThree = (board) => {
    let matches = [];
    for (let i = 0; i <= 39; i++) {
      const col = [i, i + width, i + 2 * width];
      const color = board[i];
      if (
        color &&
        col.every((idx) => board[idx] === color)
      ) {
        matches = matches.concat(col);
      }
    }
    return [...new Set(matches)];
  };

  // Helper: Move fruits down to fill empty spaces
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

  // Helper: Clear matches repeatedly until stable
  const clearMatchesUntilStable = (board) => {
    let totalMatches = [];
    let newBoard = [...board];
    let matchesExist = true;

    while (matchesExist) {
      const rowMatches = checkForRowOfThree(newBoard);
      const colMatches = checkForColumnOfThree(newBoard);
      const allMatches = [...new Set([...rowMatches, ...colMatches])];

      if (allMatches.length === 0) {
        matchesExist = false;
      } else {
        totalMatches = [...totalMatches, ...allMatches];
        allMatches.forEach((idx) => (newBoard[idx] = ""));
        moveFruitsDown(newBoard);
      }
    }

    return { newBoard, totalMatches };
  };

  // Initialize level
  const startLevel = (level) => {
    const config = levelConfig[level - 1] || levelConfig[levelConfig.length - 1];
    setLives(config.lives);
    setMovesLeft(config.moves);
    setScore(0);
    setGoalScore(config.goalScore);
    setGameState("waiting");
    setMatchedIndices([]);
    setCurrentLevel(level);

    setClaimedLevels((prev) => {
      if (level > 1 && !prev.includes(level - 1)) {
        return [...prev, level - 1];
      }
      return prev;
    });

    // Create new random board without initial matches
    let randomColors = Array.from({ length: width * width }, () =>
      candyColors[Math.floor(Math.random() * candyColors.length)]
    );

    let stable = false;
    while (!stable) {
      const rowMatches = checkForRowOfThree(randomColors);
      const colMatches = checkForColumnOfThree(randomColors);
      const allMatches = [...new Set([...rowMatches, ...colMatches])];

      if (allMatches.length > 0) {
        allMatches.forEach((idx) => (randomColors[idx] = ""));
        moveFruitsDown(randomColors);
      } else {
        stable = true;
      }
    }

    setCurrentColorArrangement(randomColors);
  };

  // Drag handlers
  const dragStart = (e) => setSquareBeingDragged(e.target);
  const dragDrop = (e) => setSquareBeingReplaced(e.target);

  // Handle candy swap and matches
  const dragEnd = () => {
    if (
      !squareBeingDragged ||
      !squareBeingReplaced ||
      lives <= 0 ||
      movesLeft <= 0 ||
      (gameState !== "waiting" && gameState !== "level-up")
    ) return;

    const draggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const replacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    const board = [...currentColorArrangement];
    const validMoves = [
      draggedId - 1,
      draggedId + 1,
      draggedId - width,
      draggedId + width,
    ];

    if (!validMoves.includes(replacedId)) return;

    // Swap candies
    const draggedColor = board[draggedId];
    const replacedColor = board[replacedId];

    board[draggedId] = replacedColor;
    board[replacedId] = draggedColor;

    // Check if swap creates any matches
    const rowMatches = checkForRowOfThree(board);
    const colMatches = checkForColumnOfThree(board);
    const allMatches = [...new Set([...rowMatches, ...colMatches])];

    if (allMatches.length > 0) {
      // Clear matches repeatedly until no more matches
      const { newBoard, totalMatches } = clearMatchesUntilStable(board);

      setCurrentColorArrangement(newBoard);
      setMatchedIndices(totalMatches);

      // Update score by total matches cleared
      setScore((prev) => prev + totalMatches.length * SCORE_PER_CANDY);

      // Deduct moves and lives on a successful move
      setMovesLeft((m) => Math.max(0, m - 1));
      setLives((l) => Math.max(0, l - 1));
    } else {
      // Revert swap if no matches
      board[draggedId] = draggedColor;
      board[replacedId] = replacedColor;
      setCurrentColorArrangement(board);

      // Deduct lives and moves for unsuccessful move as well (optional)
      // Uncomment next two lines if you want to penalize invalid swaps
      // setMovesLeft((m) => Math.max(0, m - 1));
      // setLives((l) => Math.max(0, l - 1));
    }

    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);
  };

  // Interval checks for game state and gravity
  useEffect(() => {
    if (gameState === "game-over" || gameState === "win") return;

    const interval = setInterval(() => {
      setCurrentColorArrangement((prevBoard) => {
        let board = [...prevBoard];

        // Move fruits down if possible (to fill empty spaces)
        let moved = false;
        for (let i = 55; i >= 0; i--) {
          if (board[i + width] === "") {
            board[i + width] = board[i];
            board[i] = "";
            moved = true;
          }
        }
        for (let i = 0; i < width; i++) {
          if (board[i] === "") {
            board[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
            moved = true;
          }
        }

        if (moved) {
          return board;
        } else {
          return prevBoard;
        }
      });

      // Check if player has won or lost
      if (movesLeft <= 0 || lives <= 0) {
        setGameState("game-over");
      } else if (score >= goalScore) {
        setGameState("level-up");
        setShowLevelUp(true);

        setTimeout(() => {
          setShowLevelUp(false);
          if (currentLevel < levelConfig.length) {
            startLevel(currentLevel + 1);
          } else {
            setGameState("win");
          }
        }, 2500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [movesLeft, lives, score, gameState, currentLevel, goalScore]);

  // Daily Treat claim
  const claimDailyTreat = () => {
    if (!dailyTreatAvailable) return;

    const treat = dailyTreatOptions[Math.floor(Math.random() * dailyTreatOptions.length)];

    if (treat.label.includes("Life")) {
      setLives((l) => l + 1);
    } else if (treat.label.includes("Moves")) {
      setMovesLeft((m) => m + 5);
    } else if (treat.label.includes("Score")) {
      setScore((s) => s + 50);
    }

    setDailyTreatMessage(`🎉 You got: ${treat.label}`);
    setDailyTreatAvailable(false);
    localStorage.setItem("dailyTreatClaimDate", new Date().toDateString());

    setTimeout(() => setDailyTreatMessage(""), 4000);
  };

  // Render level map
  const renderLevelMap = () => (
    <div className="flex justify-center space-x-4 my-6 flex-wrap max-w-xl mx-auto">
      {levelConfig.map((level, i) => {
        const completed = claimedLevels.includes(i);
        const current = i + 1 === currentLevel;
        const locked = i + 1 > currentLevel;

        return (
          <div
            key={i}
            onClick={() => {
              if (!locked) startLevel(i + 1);
            }}
            className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center
              ${completed ? "bg-green-500" : locked ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600"}
              ${current ? "ring-4 ring-yellow-400" : ""}
              text-white font-bold select-none transition-transform hover:scale-110`}
            title={`Level ${i + 1} - Goal: ${level.goalScore}`}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-yellow-300">Candy Crush Clone</h1>

      {/* Status bars */}
      <div className="flex space-x-8 mb-4">
        <div>❤️ Lives: {lives}</div>
        <div>🎮 Moves: {movesLeft}</div>
        <div>⭐ Score: {score}</div>
        <div>🏆 Goal: {goalScore}</div>
        <div>📍 Level: {currentLevel}</div>
      </div>

      {/* Daily Treat Button */}
      {dailyTreatAvailable && (
        <button
          onClick={claimDailyTreat}
          className="mb-4 px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition"
        >
          Claim Daily Treat 🎁
        </button>
      )}

      {dailyTreatMessage && (
        <div className="mb-4 text-green-400 font-semibold">{dailyTreatMessage}</div>
      )}

      {/* Level Up or Game Over messages */}
      {showLevelUp && <div className="text-3xl text-green-400 mb-4">🎉 Level Up! 🎉</div>}
      {gameState === "game-over" && (
        <div className="text-3xl text-red-600 mb-4">Game Over! Try Again.</div>
      )}
      {gameState === "win" && (
        <div className="text-3xl text-yellow-400 mb-4">🎉 You won the game! 🎉</div>
      )}

      {/* Board */}
      <div
        className="grid grid-cols-8 gap-1 border-4 border-yellow-400 rounded-md p-2 bg-gray-800"
        style={{ width: "320px" }}
      >
        {currentColorArrangement.map((candy, index) => (
          <img
            key={index}
            src={candyImages[candy]}
            alt={candy}
            draggable={gameState === "waiting" || gameState === "level-up"}
            data-id={index}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            className={`w-10 h-10 rounded cursor-grab ${
              matchedIndices.includes(index) ? "opacity-50" : "opacity-100"
            }`}
            style={{ userSelect: "none" }}
          />
        ))}
      </div>

      {/* Level Map */}
      {renderLevelMap()}

      {/* Start button */}
      {(gameState === "waiting" || gameState === "game-over" || gameState === "win") && (
        <button
          onClick={() => {
            if (gameState === "win") {
              setClaimedLevels([]);
              startLevel(1);
              setGameState("waiting");
            } else {
              startLevel(currentLevel);
              setGameState("waiting");
            }
          }}
          className="mt-6 px-6 py-3 bg-yellow-400 rounded text-gray-900 font-bold hover:bg-yellow-500 transition"
        >
          {gameState === "game-over"
            ? "Retry Level"
            : gameState === "win"
            ? "Play Again"
            : "Start Game"}
        </button>
      )}
    </div>
  );
}
