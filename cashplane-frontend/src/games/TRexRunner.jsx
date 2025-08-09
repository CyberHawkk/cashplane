import React, { useEffect, useRef } from "react";

const TRexRunner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Canvas context is null");
      return;
    }

    let animationId;

    let trex = {
      x: 50,
      y: 150,
      width: 40,
      height: 40,
      velocityY: 0,
      jumping: false,
    };

    const gravity = 1.5;
    const groundY = 190;
    let obstacles = [];
    let frame = 0;

    const jump = () => {
      if (!trex.jumping) {
        trex.velocityY = -20;
        trex.jumping = true;
      }
    };

    const update = () => {
      try {
        animationId = requestAnimationFrame(update);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        context.fillStyle = "#f4f4f4";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Ground
        context.fillStyle = "#888";
        context.fillRect(0, groundY, canvas.width, 10);

        // Trex gravity
        trex.velocityY += gravity;
        trex.y += trex.velocityY;

        if (trex.y >= 150) {
          trex.y = 150;
          trex.jumping = false;
        }

        // Draw Trex
        context.fillStyle = "#111";
        context.fillRect(trex.x, trex.y, trex.width, trex.height);

        // Add new obstacles (faster for quick testing)
        if (frame % 60 === 0) {
          obstacles.push({
            x: canvas.width,
            width: 20 + Math.random() * 10,
            height: 40,
          });
        }

        // Draw and update obstacles
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
      } catch (error) {
        console.error("Error in game loop:", error);
        cancelAnimationFrame(animationId);
      }
    };

    // Start the game
    update();

    // Handle key + click for jumping
    const handleKeyDown = (e) => {
      if (e.code === "Space") jump();
    };
    const handleClick = () => jump();

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl font-bold mb-2">🦖 T-Rex Runner</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{
          backgroundColor: "#ffffff",
          border: "2px solid #000",
          cursor: "pointer",
        }}
        className="rounded-md shadow-md"
      />
      <p className="text-sm text-gray-600 mt-2">
        Press <strong>Space</strong> or <strong>Click</strong> to jump!
      </p>
    </div>
  );
};

export default TRexRunner;
