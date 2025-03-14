// TetrisApp.tsx - Main component for Tetris game UI and logic

import React, { useEffect } from "react";
import ScoreAndLevel from "./components/InfoSection/ScoreAndLevel";
import NextTetrominoes from "./components/InfoSection/NextTetrominoes";
import GameControls from "./components/InfoSection/GameControls";
import BoardContainer from "./components/BoardContainer/BoardContainer";
import Scoreboard from "./components/Scoreboard/Scoreboard";
import GameBoard from "./components/BoardContainer/GameBoard";
import { TIMER } from "./constants/gameConstants";
import { useGameLogic } from "./hooks/useGameLogic";
import { useAudioSettings } from "./hooks/useAudioSettings";
import "./styles/layout.css";

const TetrisApp: React.FC = () => {
  // Audio settings hook
  const { isMuted, soundLevel, setSoundLevel, toggleMute, updateThemeMusicPlayback, updateMuteState, updateVolume, updateThemeMusicSpeed, playSoundEffect, resetThemeMusic } = useAudioSettings();

  // Game logic hook
  const { board, currentTetromino, nextTetrominoes, gameOver, score, level, timeLeft, isPaused, showLineAnimation, showRotationEffect, gameStarted, togglePause, startNewGame: startGame } = useGameLogic(playSoundEffect, isMuted);

  // Start new game with theme music reset
  const startNewGame = () => {
    startGame(resetThemeMusic);
  };

  // Sync audio states with game status
  useEffect(() => {
    updateThemeMusicPlayback(gameStarted, isPaused, gameOver, isMuted);
  }, [gameStarted, isPaused, gameOver, isMuted, updateThemeMusicPlayback]);

  useEffect(() => {
    updateMuteState(isMuted);
  }, [isMuted, updateMuteState]);

  useEffect(() => {
    updateVolume(soundLevel);
  }, [soundLevel, updateVolume]);

  useEffect(() => {
    updateThemeMusicSpeed(level, isMuted, gameStarted);
  }, [level, isMuted, gameStarted, updateThemeMusicSpeed]);

  return (
    <div className="tetris-container">
      <div className="tetris-wrapper">
        <div className="left-section">
          <div className="info-section">
            <ScoreAndLevel score={score} level={level} timeLeft={timeLeft} TIMER={TIMER} />
            <NextTetrominoes tetrominoes={nextTetrominoes} />
            <GameControls gameStarted={gameStarted} isPaused={isPaused} isMuted={isMuted} soundLevel={soundLevel} onTogglePause={togglePause} onToggleMute={toggleMute} onStartNewGame={startNewGame} onSoundLevelChange={setSoundLevel} />
          </div>
        </div>

        <BoardContainer
          board={board}
          currentTetromino={currentTetromino}
          gameOver={gameOver}
          gameStarted={gameStarted}
          isPaused={isPaused}
          score={score}
          showLineAnimation={showLineAnimation}
          showRotationEffect={showRotationEffect}
          startNewGame={startNewGame}
          renderBoard={() => <GameBoard board={board} currentTetromino={currentTetromino} showLineAnimation={showLineAnimation} showRotationEffect={showRotationEffect} />}
        />

        <Scoreboard currentScore={score} currentLevel={level} gameOver={gameOver} gameStarted={gameStarted} />
      </div>
    </div>
  );
};

export default TetrisApp;
