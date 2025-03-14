// Component to render the Tetris game board with tetromino and ghost visuals
import React from "react";
import { GameBoardProps } from "./types";
import { useTetrominoPosition } from "../../hooks/useTetrominoPosition";
import "./GameBoard.css";

const GameBoard: React.FC<GameBoardProps> = ({ board, currentTetromino, showLineAnimation, showRotationEffect }) => {
  const { getGhostPosition, isOverlappingWithActive } = useTetrominoPosition(board, currentTetromino);
  const ghostPosition = getGhostPosition(); // Lowest valid drop position

  return (
    <>
      {board.map((row, y) => (
        <div className="row" key={`row-${y}`}>
          {row.map((cell, x) => {
            let isActiveTetromino = false;
            let color = cell;
            let isGhost = false;
            const isLineAnimation = showLineAnimation.includes(y);
            for (let tY = 0; tY < currentTetromino.shape.length; tY++) {
              for (let tX = 0; tX < currentTetromino.shape[tY].length; tX++) {
                if (currentTetromino.shape[tY][tX] && currentTetromino.position.x + tX === x && currentTetromino.position.y + tY === y) {
                  isActiveTetromino = true;
                  color = currentTetromino.color;
                }
              }
            }

            // Check for ghost position (only if not overlapped by active tetromino)
            if (!isActiveTetromino) {
              for (let tY = 0; tY < currentTetromino.shape.length; tY++) {
                for (let tX = 0; tX < currentTetromino.shape[tY].length; tX++) {
                  if (currentTetromino.shape[tY][tX] && ghostPosition.x + tX === x && ghostPosition.y + tY === y) {
                    // Only show ghost if not overlapped by active tetromino
                    if (!isOverlappingWithActive(x, y, ghostPosition)) {
                      isGhost = true;
                      color = currentTetromino.color;
                    }
                  }
                }
              }
            }

            return (
              <div
                className={`cell ${isActiveTetromino ? "active" : ""} ${isGhost ? "ghost" : ""} ${isLineAnimation ? "line-clear" : ""} ${showRotationEffect && isActiveTetromino ? "rotate-effect" : ""}`}
                key={`cell-${x}-${y}`}
                style={{
                  backgroundColor: isGhost ? "transparent" : color || "transparent",
                  borderColor: isGhost ? color || "transparent" : "rgba(0, 0, 0, 0.1)",
                }}
              ></div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default GameBoard;
