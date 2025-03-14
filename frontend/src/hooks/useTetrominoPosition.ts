// Custom hook for managing tetromino positioning and ghost piece logic
import { useCallback } from "react";
import { Board, Tetromino, Position } from "../components/InfoSection/types";
import { isValidMove } from "../utils/boardUtils";

export const useTetrominoPosition = (board: Board, currentTetromino: Tetromino) => {
  // Calculate ghost piece position (lowest valid drop point)
  const getGhostPosition = useCallback((): Position => {
    let ghostY = currentTetromino.position.y;

    while (isValidMove(board, { ...currentTetromino, position: { x: currentTetromino.position.x, y: ghostY + 1 } }, 0, 0)) {
      ghostY++;
    }

    return {
      x: currentTetromino.position.x,
      y: ghostY,
    };
  }, [board, currentTetromino]);

  // Check if a cell is overlapped by the active tetromino within its ghost position
  const isOverlappingWithActive = useCallback(
    (x: number, y: number, ghostPosition: Position): boolean => {
      let isGhostPosition = false;
      for (let tY = 0; tY < currentTetromino.shape.length; tY++) {
        for (let tX = 0; tX < currentTetromino.shape[tY].length; tX++) {
          if (currentTetromino.shape[tY][tX] && ghostPosition.x + tX === x && ghostPosition.y + tY === y) {
            isGhostPosition = true;
          }
        }
      }
      // If in ghost, check overlap with active tetromino
      if (isGhostPosition) {
        for (let tY = 0; tY < currentTetromino.shape.length; tY++) {
          for (let tX = 0; tX < currentTetromino.shape[tY].length; tX++) {
            if (currentTetromino.shape[tY][tX] && currentTetromino.position.x + tX === x && currentTetromino.position.y + tY === y) {
              return true; // Overlap detected
            }
          }
        }
      }
      return false;
    },
    [currentTetromino]
  );

  return {
    getGhostPosition,
    isOverlappingWithActive,
  };
};
