// Component to display Tetris score, level, and timer
import React from "react";
import "./ScoreAndLevel.css";
import { ScoreAndLevelProps } from "./types";

const ScoreAndLevel: React.FC<ScoreAndLevelProps> = ({ score, level, timeLeft, TIMER }) => {
  return (
    <div className="info-section-top">
      <h2>Score: {score}</h2>
      <h3>Level: {level}</h3>
      <div className="timer">
        <div className="timer-bar" style={{ width: `${(timeLeft / TIMER) * 100}%` }}></div>
        <p>{timeLeft}s</p>
      </div>
    </div>
  );
};

export default ScoreAndLevel;
