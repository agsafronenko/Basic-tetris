export type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type Position = {
  x: number;
  y: number;
};

export type Board = (string | null)[][];

export interface Tetromino {
  shape: number[][];
  position: Position;
  type: TetrominoType;
  color: string;
}

export interface BoardContainerProps {
  board: Board;
  currentTetromino: Tetromino;
  gameOver: boolean;
  gameStarted: boolean;
  isPaused: boolean;
  score: number;
  showLineAnimation: number[];
  showRotationEffect: boolean;
  startNewGame: () => void;
  renderBoard: () => React.ReactNode;
}

export interface GameBoardProps {
  board: Board;
  currentTetromino: Tetromino;
  showLineAnimation: number[];
  showRotationEffect: boolean;
}
