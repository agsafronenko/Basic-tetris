// Component for Tetris game controls and audio settings
import React from "react";
import "./GameControls.css";
import { GameControlsProps } from "./types";

const GameControls: React.FC<GameControlsProps> = ({ gameStarted, isPaused, isMuted, soundLevel, onTogglePause, onToggleMute, onStartNewGame, onSoundLevelChange }) => {
  return (
    <div className="info-section-bottom">
      <div className="game-buttons">
        {!gameStarted ? (
          <button className="control-button" onClick={onStartNewGame}>
            New Game
          </button>
        ) : (
          <button className="control-button" onClick={onTogglePause}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button className={`control-button mute-button ${isMuted ? "muted" : ""}`} onClick={onToggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <div className="sound-slider">
          <input type="range" min="0" max="1" step="0.01" value={soundLevel} onChange={(e) => onSoundLevelChange(parseFloat(e.target.value))} />
        </div>
      </div>
      <div className="controls">
        <p>↑ Rotate</p>
        <p>← → Move</p>
        <p>↓ Drop</p>
      </div>
    </div>
  );
};

export default GameControls;
