// src/games/TRexRunner.jsx
import React, { useEffect, useRef } from "react";

const TRexRunner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationId;

    let trex = {
      x: 50,
      y: 150,
      width: 40,
      height: 40,
      velocityY: 0,
      jumping: false,
    };

    let gravity = 1.5;
    let groundY = 190;
    let obstacles = [];
    let frame = 0;

    const jump = () => {
      if (!trex.jumping) {
        trex.velocityY = -20;
        trex.jumping = true;
      }
    };

    const update = () => {
      animationId = requestAnimationFrame(update);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      context.fillStyle = "#f4f4f4";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      context.fillStyle = "#888";
      context.fillRect(0, groundY, canvas.width, 10);

      // Trex
      trex.velocityY += gravity;
      trex.y += trex.velocityY;

      if (trex.y >= 150) {
        trex.y = 150;
        trex.jumping = false;
      }

      context.fillStyle = "#111";
      context.fillRect(trex.x, trex.y, trex.width, trex.height);

      // Obstacles
      if (frame % 90 === 0) {
        obstacles.push({
          x: canvas.width,
          width: 20 + Math.random() * 10,
          height: 40,
        });
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= 5;
        context.fillStyle = "#d33";
        context.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);

        // Collision detection
        if (
          trex.x < obs.x + obs.width &&
          trex.x + trex.width > obs.x &&
          trex.y + trex.height > groundY - obs.height
        ) {
          cancelAnimationFrame(animationId);
          alert("💥 Game Over!");
          return;
        }
      }

      // Remove off-screen obstacles
      obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

      frame++;
    };

    update();

    // Listen for jump
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") jump();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", jump);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-2">🦖 T-Rex Runner</h2>
      <canvas ref={canvasRef} width={600} height={200} className="bg-white rounded-md shadow-md" />
      <p className="text-sm text-gray-600 mt-2">Press <strong>Space</strong> to jump!</p>
    </div>
  );
};

export default TRexRunner;
