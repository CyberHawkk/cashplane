import React, { useEffect, useState } from "react";
import "../index.css";

const width = 8;
const candyColors = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow",
];

const CandyCrush = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        columnOfThree.forEach((square) => (currentColorArrangement[square] = ""));
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23,
        30, 31, 38, 39, 46, 47,
        54, 55,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        rowOfThree.forEach((square) => (currentColorArrangement[square] = ""));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const isBlank = currentColorArrangement[i + width] === "";
      if (isBlank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = "";
      }
    }
  };

  const generateRandomColor = () =>
    candyColors[Math.floor(Math.random() * candyColors.length)];

  const fillEmptySquares = () => {
    for (let i = 0; i < 8; i++) {
      if (currentColorArrangement[i] === "") {
        currentColorArrangement[i] = generateRandomColor();
      }
    }
  };

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {
    const draggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const replacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    const validMoves = [
      draggedId - 1,
      draggedId + 1,
      draggedId - width,
      draggedId + width,
    ];

    const isValidMove = validMoves.includes(replacedId);

    if (isValidMove) {
      currentColorArrangement[replacedId] =
        squareBeingDragged.getAttribute("data-color");
      currentColorArrangement[draggedId] =
        squareBeingReplaced.getAttribute("data-color");

      const isAColumnOfThree = checkForColumnOfThree();
      const isARowOfThree = checkForRowOfThree();

      if (isAColumnOfThree || isARowOfThree) {
        setSquareBeingDragged(null);
        setSquareBeingReplaced(null);
      } else {
        currentColorArrangement[replacedId] =
          squareBeingReplaced.getAttribute("data-color");
        currentColorArrangement[draggedId] =
          squareBeingDragged.getAttribute("data-color");
        setCurrentColorArrangement([...currentColorArrangement]);
      }
    }
  };

  useEffect(() => {
    const randomColors = Array.from({ length: width * width }, () =>
      generateRandomColor()
    );
    setCurrentColorArrangement(randomColors);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      fillEmptySquares();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [currentColorArrangement]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">🍬 Candy Crush Clone</h1>
      <div
        className="grid grid-cols-8 gap-1 w-[320px] h-[320px]"
        style={{ backgroundColor: "#111", border: "2px solid #444" }}
      >
        {currentColorArrangement.map((candyColor, index) => (
          <div
            key={index}
            data-id={index}
            data-color={candyColor}
            className="w-10 h-10 rounded-sm"
            style={{
              backgroundColor: candyColor,
            }}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default CandyCrush;
