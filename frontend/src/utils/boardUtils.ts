// Utility functions for Tetris board management and validation
import { Board, Tetromino } from "../components/InfoSection/types";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants/gameConstants";

// Create an empty Tetris board
export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null));
};

// Check if a tetromino move is valid
export const isValidMove = (board: Board, tetromino: Tetromino, offsetX: number, offsetY: number): boolean => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = tetromino.position.x + x + offsetX;
        const newY = tetromino.position.y + y + offsetY;

        if (newX < 0 || newX >= BOARD_WIDTH || newY < 0 || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
          return false;
        }
      }
    }
  }
  return true;
};

// Merge tetromino into board and detect completed lines
export const mergeTetromino = (board: Board, currentTetromino: Tetromino) => {
  const newBoard = [...board.map((row) => [...row])];
  const completedLines: number[] = [];

  // Add tetromino cells to board
  for (let y = 0; y < currentTetromino.shape.length; y++) {
    for (let x = 0; x < currentTetromino.shape[y].length; x++) {
      if (currentTetromino.shape[y][x]) {
        const boardY = currentTetromino.position.y + y;
        const boardX = currentTetromino.position.x + x;

        // Safeguard: Ensure the tetromino doesn't go below the board
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = currentTetromino.color;
        }
      }
    }
  }

  // Check for completed lines
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (newBoard[y].every((cell) => cell !== null)) {
      completedLines.push(y);
    }
  }

  return { newBoard, completedLines };
};
