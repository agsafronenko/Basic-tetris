import React from "react";
import { ScoreTableProps } from "./types";
import NameEditor from "./NameEditor";
import PlayerStats from "./PlayerStats";
import "./ScoreTable.css";

const ScoreTable: React.FC<ScoreTableProps> = ({ displayScores, playerRank, playerId, playerName, isRankingUp, isEditingName, gameOver, gameStarted, currentScore, currentLevel, handleEditName, handleSaveName, handleCancelEdit }) => {
  return (
    <div className="scoreboard-table-container">
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th className="rank-column">Rank</th>
            <th className="name-column">Player</th>
            <th className="score-column">Score</th>
            <th className="level-column">Level</th>
          </tr>
        </thead>
        <tbody>
          {displayScores.map((score, index) => {
            // Check if this is current player's score
            const isCurrentGameScore = score._id === playerId;
            const isActiveTempScore = score._id === "current-game-temp-id";

            let rowClass = "";
            if (index === 0) rowClass = "gold-rank";
            else if (index === 1) rowClass = "silver-rank";
            else if (index === 2) rowClass = "bronze-rank";

            if (isCurrentGameScore || isActiveTempScore) rowClass += " player-row";
            if ((isCurrentGameScore || isActiveTempScore) && isRankingUp) rowClass += " ranking-up";

            return (
              <tr key={score._id || `temp-${index}`} className={rowClass}>
                <td>{index + 1}</td>
                <td>
                  {isCurrentGameScore && isEditingName ? (
                    <NameEditor initialName={score.name} onSave={handleSaveName} onCancel={handleCancelEdit} />
                  ) : (
                    <span
                      onClick={() => {
                        if (isCurrentGameScore && gameOver) {
                          handleEditName(score);
                        }
                      }}
                      className={isCurrentGameScore && gameOver ? "editable-name" : ""}
                      title={isCurrentGameScore && gameOver ? "Click to edit your name" : ""}
                    >
                      {score.name} {isActiveTempScore ? "(current)" : ""}
                    </span>
                  )}
                </td>
                <td>{score.score.toLocaleString()}</td>
                <td>{score.level}</td>
              </tr>
            );
          })}

          {/* Show current player's in-progress score if not in top 15 but game is active */}
          {playerRank !== null && playerRank > 14 && gameStarted && !gameOver && currentScore > 0 && <PlayerStats playerRank={playerRank} playerName={playerName} currentScore={currentScore} currentLevel={currentLevel} />}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
