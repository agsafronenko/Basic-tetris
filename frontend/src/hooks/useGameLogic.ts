// Custom hook for Tetris game logic, state management, and controls
import { useState, useRef, useCallback, useEffect } from "react";
import { Board, Tetromino } from "../components/InfoSection/types";
import { createEmptyBoard, mergeTetromino, isValidMove } from "../utils/boardUtils";
import { randomTetromino, rotateTetromino } from "../utils/tetrominoUtils";
import { INITIAL_SPEED, TIMER, BOARD_WIDTH } from "../constants/gameConstants";

export const useGameLogic = (playSoundEffect: (sound: "pause" | "rowClear" | "gameOver", isMuted: boolean, gameStarted?: boolean) => void, isMuted: boolean) => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [nextTetrominoes, setNextTetrominoes] = useState<Tetromino[]>([randomTetromino(), randomTetromino(), randomTetromino()]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [isPaused, setIsPaused] = useState(false);
  const [showLineAnimation, setShowLineAnimation] = useState<number[]>([]);
  const [showRotationEffect, setShowRotationEffect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Refs for game timing and state
  const dropSpeedRef = useRef(INITIAL_SPEED);
  const requestRef = useRef<number | null>(null);
  const dropCounterRef = useRef(0);
  const lastDropTimeRef = useRef(0);
  const lastTimerTimeRef = useRef(0);
  const levelUpdatedRef = useRef(false);
  const lastSoftDropTimeRef = useRef(0);

  // Adjust drop speed by 10% per level
  useEffect(() => {
    dropSpeedRef.current = INITIAL_SPEED * Math.pow(0.9, level - 1);
  }, [level]);

  // Fetch and set next tetromino
  const getNextTetromino = useCallback(() => {
    const newTetromino = nextTetrominoes[0];
    const newNextTetrominoes = [...nextTetrominoes.slice(1), randomTetromino()];
    setCurrentTetromino(newTetromino);
    setNextTetrominoes(newNextTetrominoes);

    // Check if game over - can't place new tetromino
    if (!isValidMove(board, newTetromino, 0, 0)) {
      setGameOver(true);
      playSoundEffect("gameOver", isMuted, gameStarted);
      setGameStarted(false);
    }
  }, [board, nextTetrominoes, gameStarted, isMuted, playSoundEffect]);

  // Merge tetromino into board and handle lines
  const handleMergeTetromino = useCallback(() => {
    const { newBoard, completedLines } = mergeTetromino(board, currentTetromino);

    // If lines were completed, show animation and update score
    if (completedLines.length) {
      setShowLineAnimation(completedLines);
      playSoundEffect("rowClear", isMuted, gameStarted);

      // Set a timeout to remove lines after animation
      setTimeout(() => {
        setShowLineAnimation([]);

        // Remove completed lines
        const updatedBoard = [...newBoard];
        for (const lineY of completedLines) {
          updatedBoard.splice(lineY, 1);
          updatedBoard.unshift(Array(BOARD_WIDTH).fill(null));
        }

        // Update score
        const additionalScore = [0, 40, 100, 300, 1200][completedLines.length] * level;
        setScore((prevScore) => prevScore + additionalScore);

        setBoard(updatedBoard);
      }, 500); // Animation duration
    } else {
      setBoard(newBoard);
    }

    getNextTetromino();
  }, [board, currentTetromino, gameStarted, getNextTetromino, isMuted, level, playSoundEffect]);

  // Move tetromino with validation
  const moveTetromino = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!isPaused && !gameOver && gameStarted) {
        // Delay for soft drops to prevent moving too fast
        if (deltaY > 0 && Date.now() - lastSoftDropTimeRef.current < 50) {
          return false; // Skip this move if the soft drop is too fast
        }
        if (isValidMove(board, currentTetromino, deltaX, deltaY)) {
          setCurrentTetromino((prev) => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY,
            },
          }));

          // Update the last soft drop time
          if (deltaY > 0) {
            lastSoftDropTimeRef.current = Date.now();
          }

          return true;
        }

        // If can't move down, merge with board
        if (deltaY > 0) {
          handleMergeTetromino();
        }
        return false;
      }
      return false;
    },
    [board, currentTetromino, gameOver, isPaused, gameStarted, handleMergeTetromino]
  );

  // Rotate tetromino with effect
  const handleRotateTetromino = useCallback(() => {
    if (!isPaused && !gameOver && gameStarted) {
      const rotationResult = rotateTetromino(board, currentTetromino);

      if (rotationResult.success) {
        setCurrentTetromino(rotationResult.tetromino);
        setShowRotationEffect(true);
        setTimeout(() => setShowRotationEffect(false), 200);
        return true;
      }
    }
    return false;
  }, [board, currentTetromino, gameOver, gameStarted, isPaused]);

  // Main game loop for dropping and timer
  const gameLoop = useCallback(
    (timestamp: number) => {
      requestRef.current = requestAnimationFrame(gameLoop);

      if (!isPaused && !gameOver && gameStarted) {
        // Handle automatic Tetromino dropping
        const deltaTime = timestamp - lastDropTimeRef.current;
        lastDropTimeRef.current = timestamp;

        dropCounterRef.current += deltaTime;

        if (dropCounterRef.current >= dropSpeedRef.current) {
          moveTetromino(0, 1); // Move Tetromino down by one row
          dropCounterRef.current = 0; // Reset the drop counter
        }

        // Timer Update (every second)
        if (timestamp - lastTimerTimeRef.current >= 1000) {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              if (!levelUpdatedRef.current) {
                setLevel((prevLevel) => prevLevel + 1);
                levelUpdatedRef.current = true;
              }
              return TIMER; // reset the timer
            }
            return prevTime - 1;
          });
          lastTimerTimeRef.current = timestamp;
        }

        if (timeLeft === TIMER) {
          levelUpdatedRef.current = false;
        }
      }
    },
    [gameOver, isPaused, moveTetromino, gameStarted, timeLeft]
  );

  // Start game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Toggle game pause
  const togglePause = useCallback(() => {
    playSoundEffect("pause", isMuted);
    setIsPaused((prev) => !prev);
  }, [isMuted, playSoundEffect]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !gameStarted) return;

      switch (e.key) {
        case "ArrowLeft":
          moveTetromino(-1, 0);
          break;
        case "ArrowRight":
          moveTetromino(1, 0);
          break;
        case "ArrowDown":
          moveTetromino(0, 1);
          break;
        case "ArrowUp":
          handleRotateTetromino();
          break;
        case "p":
        case "P":
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, gameStarted, moveTetromino, handleRotateTetromino, togglePause]);

  // Reset game state for new game
  const startNewGame = useCallback(
    (resetThemeMusic: () => void) => {
      playSoundEffect("pause", isMuted);

      setBoard(createEmptyBoard());
      setCurrentTetromino(randomTetromino());
      setNextTetrominoes([randomTetromino(), randomTetromino(), randomTetromino()]);
      setGameOver(false);
      setScore(0);
      setLevel(1);
      setTimeLeft(TIMER);
      setIsPaused(false);
      setGameStarted(true);
      dropSpeedRef.current = INITIAL_SPEED;

      resetThemeMusic();
    },
    [isMuted, playSoundEffect]
  );

  return {
    board,
    currentTetromino,
    nextTetrominoes,
    gameOver,
    score,
    level,
    timeLeft,
    isPaused,
    showLineAnimation,
    showRotationEffect,
    gameStarted,
    moveTetromino,
    handleRotateTetromino,
    togglePause,
    startNewGame,
  };
};
