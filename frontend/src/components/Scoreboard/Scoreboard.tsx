import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { ScoreboardProps } from "./types";
import ScoreTable from "./ScoreTable";
import { useScoreboardData } from "../../hooks/useScoreboardData";
import "./Scoreboard.css";

const Scoreboard: React.FC<ScoreboardProps> = ({ currentScore, currentLevel, gameOver, gameStarted }) => {
  const { displayScores, playerName, playerRank, isEditingName, playerId, showTooltip, isRankingUp, handleEditName, handleSaveName, handleCancelEdit } = useScoreboardData(currentScore, currentLevel, gameOver, gameStarted);

  return (
    <div className="scoreboard-container">
      <h2>
        <FontAwesomeIcon icon={faTrophy} color="#ffc107" /> Top 15
      </h2>

      <ScoreTable
        displayScores={displayScores}
        playerRank={playerRank}
        playerId={playerId}
        playerName={playerName}
        isRankingUp={isRankingUp}
        isEditingName={isEditingName}
        gameOver={gameOver}
        gameStarted={gameStarted}
        currentScore={currentScore}
        currentLevel={currentLevel}
        handleEditName={handleEditName}
        handleSaveName={handleSaveName}
        handleCancelEdit={handleCancelEdit}
      />

      {showTooltip && gameOver && playerRank !== null && playerRank < 15 && <div className="name-change-tooltip">Click on your name to change it!</div>}
    </div>
  );
};

export default Scoreboard;
