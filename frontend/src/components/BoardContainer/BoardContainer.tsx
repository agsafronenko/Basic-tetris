// Component to render Tetris board and game state overlays
import React from "react";
import { BoardContainerProps } from "./types";
import "./BoardContainer.css";

const BoardContainer: React.FC<BoardContainerProps> = ({ gameOver, gameStarted, isPaused, score, startNewGame, renderBoard }) => {
  return (
    <div className="board-container">
      <div className="board">{renderBoard()}</div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button onClick={startNewGame}>Play Again</button>
        </div>
      )}
      {!gameStarted && !gameOver && (
        <div className="game-over">
          <h2>Tetris</h2>
          <button onClick={startNewGame}>Start Game</button>
        </div>
      )}
      {isPaused && <div className="pause-overlay">PAUSED</div>}
    </div>
  );
};

export default BoardContainer;
