import React, { useEffect, useRef, useState } from "react";

const canvasSize = 400;
const scale = 20;
const rows = canvasSize / scale;
const cols = canvasSize / scale;

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const eatSound = useRef(null);

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(randomFood());
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);

  function randomFood() {
    return {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const interval = setInterval(() => {
      if (!gameOver && !paused) {
        update();
        draw(ctx);
      }
    }, 150);

    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (dir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (dir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (dir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (dir.x !== -1) setDir({ x: 1, y: 0 });
          break;
        case " ":
          update();
          break;
        case "p":
        case "P":
          setPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKey);
    };
  }, [dir, gameOver, paused, snake]);

  const update = () => {
    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + dir.x,
      y: newSnake[0].y + dir.y,
    };

    if (
      head.x < 0 ||
      head.x >= cols ||
      head.y < 0 ||
      head.y >= rows ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(randomFood());
      setScore((prev) => prev + 1);
      try {
        eatSound.current?.play();
      } catch (err) {
        console.warn("Sound error:", err);
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw food - Red box
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = "blue"; // Head
      } else if (index === snake.length - 1) {
        ctx.fillStyle = "green"; // Tail
      } else {
        ctx.fillStyle = "lime"; // Body
      }
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
  };

  const restart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(randomFood());
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setPaused(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🐍 Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border-4 border-gray-700 rounded-lg shadow-xl"
      />
      <div className="mt-4 space-y-2 text-center">
        <p className="text-lg font-medium">Score: {score}</p>
        <p className="text-sm text-gray-500">
          Controls: Arrow keys to move | <strong>P</strong> to Pause/Resume | Space to boost
        </p>
      </div>

      <div className="mt-4 space-x-4">
        {gameOver ? (
          <button
            onClick={restart}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            🔁 Restart Game
          </button>
        ) : (
          <button
            onClick={() => setPaused((prev) => !prev)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
          >
            {paused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
        )}
      </div>

      <audio ref={eatSound} preload="auto">
        <source
          src="https://www.fesliyanstudios.com/play-mp3/387"
          type="audio/mpeg"
        />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
