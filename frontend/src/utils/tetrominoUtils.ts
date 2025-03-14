// Utility functions for Tetris tetromino generation and rotation
import { Tetromino, TetrominoType, Board } from "../components/InfoSection/types";
import { TETROMINO_SHAPES, BOARD_WIDTH } from "../constants/gameConstants";
import { isValidMove } from "./boardUtils";

// Generate a random tetromino with centered position
export const randomTetromino = (): Tetromino => {
  const types = Object.keys(TETROMINO_SHAPES) as TetrominoType[];
  const type = types[Math.floor(Math.random() * types.length)];
  const tetrominoData = TETROMINO_SHAPES[type];

  return {
    shape: tetrominoData.shape,
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetrominoData.shape[0].length / 2),
      y: 0,
    },
    type,
    color: tetrominoData.color,
  };
};

// Rotate a matrix 90 degrees clockwise
export const rotateMatrix = (matrix: number[][]): number[][] => {
  const result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    const row = [];
    for (let j = matrix.length - 1; j >= 0; j--) {
      row.push(matrix[j][i]);
    }
    result.push(row);
  }
  return result;
};

// Rotate tetromino with wall kick adjustments
export const rotateTetromino = (board: Board, currentTetromino: Tetromino) => {
  const rotatedShape = rotateMatrix(currentTetromino.shape);
  const potentialTetromino = {
    ...currentTetromino,
    shape: rotatedShape,
  };

  let wallKickOffsetX = 0;
  for (let i = 0; i < 3; i++) {
    if (isValidMove(board, potentialTetromino, i, 0)) {
      wallKickOffsetX = i;
      break;
    }
    if (isValidMove(board, potentialTetromino, -i, 0)) {
      wallKickOffsetX = -i;
      break;
    }
  }

  // Return rotated tetromino if valid, else original
  if (isValidMove(board, potentialTetromino, wallKickOffsetX, 0)) {
    return {
      success: true,
      tetromino: {
        ...currentTetromino,
        shape: rotatedShape,
        position: {
          x: currentTetromino.position.x + wallKickOffsetX,
          y: currentTetromino.position.y,
        },
      },
    };
  }

  return { success: false, tetromino: currentTetromino };
};
