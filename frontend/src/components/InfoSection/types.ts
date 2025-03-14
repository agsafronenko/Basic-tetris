// Type definitions for Tetris game info-section (display contains: score, level, next tetrominoes, game controls)
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

export interface TetrominoData {
  shape: number[][];
  color: string;
}

export interface TetrominoShapes {
  [key: string]: TetrominoData;
}

export interface GameLoopProps {
  isPaused: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  dropSpeedRef: React.MutableRefObject<number>;
  dropCounterRef: React.MutableRefObject<number>;
  lastDropTimeRef: React.MutableRefObject<number>;
  lastTimerTimeRef: React.MutableRefObject<number>;
  levelUpdatedRef: React.MutableRefObject<boolean>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  moveTetromino: (deltaX: number, deltaY: number) => boolean;
  TIMER: number;
}

export interface BoardProps {
  board: Board;
  currentTetromino: Tetromino;
  showLineAnimation: number[];
  showRotationEffect: boolean;
  getGhostPosition: () => Position;
  isOverlappingWithActive: (x: number, y: number, ghostPosition: Position) => boolean;
}

export interface GameControlsProps {
  gameStarted: boolean;
  isPaused: boolean;
  isMuted: boolean;
  soundLevel: number;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onStartNewGame: () => void;
  onSoundLevelChange: (level: number) => void;
}

export interface GameOverProps {
  score?: number;
  startNewGame: () => void;
  isInitial?: boolean;
}

export interface ScoreboardProps {
  currentScore: number;
  currentLevel: number;
  gameOver: boolean;
  gameStarted: boolean;
}

export interface TimerProps {
  timeLeft: number;
  TIMER: number;
}

export interface ScoreAndLevelProps {
  score: number;
  level: number;
  timeLeft: number;
  TIMER: number;
}

export interface NextTetrominoesProps {
  tetrominoes: Tetromino[];
}
