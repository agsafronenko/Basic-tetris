import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ScoreRecord } from "../components/Scoreboard/types";
import { getRandomName } from "../utils/funnyNames";

// Configure base URL
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const useScoreboardData = (currentScore: number, currentLevel: number, gameOver: boolean, gameStarted: boolean) => {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [displayScores, setDisplayScores] = useState<ScoreRecord[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isRankingUp, setIsRankingUp] = useState<boolean>(false);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);
  const prevRankRef = useRef<number | null>(null);

  // Initialize player name when the game starts
  useEffect(() => {
    if (gameStarted && !playerName) {
      setPlayerName(getRandomName());
    }
  }, [gameStarted, playerName]);

  // Reset game session and saved status when a new game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setScoreSaved(false);
      setPlayerId(null);
    }
  }, [gameStarted, gameOver]);

  // Load scores from the database
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get("/api/scores");
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    // Fetch immediately when component mounts
    fetchScores();

    // Polling for score updates every 5 seconds
    const intervalId = setInterval(fetchScores, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Update display scores based on current game state
  useEffect(() => {
    // Create a copy of the database scores
    let updatedScores = [...scores];

    // If game is in progress and we have a score, add current player's score to the array
    if (gameStarted && currentScore > 0 && !scoreSaved) {
      const currentPlayerEntry = {
        _id: "current-game-temp-id",
        name: playerName,
        score: currentScore,
        level: currentLevel,
        date: new Date(),
      };

      // Add only if not already in the list
      if (!playerId) {
        updatedScores.push(currentPlayerEntry);
      }
    }

    // Sort all scores
    updatedScores.sort((a, b) => b.score - a.score);

    // Limit to top 15
    setDisplayScores(updatedScores.slice(0, 15));

    if (gameStarted) {
      prevRankRef.current = playerRank;

      const newRank = updatedScores.findIndex((score) => score._id === "current-game-temp-id" || score._id === playerId);

      // Always set the player's rank, even if they are not in the top 15
      setPlayerRank(newRank);

      // Check if ranking up
      if (prevRankRef.current !== null && prevRankRef.current > newRank) {
        setIsRankingUp(true);
        setTimeout(() => setIsRankingUp(false), 1500);
      }
    }
  }, [scores, currentScore, playerName, gameStarted, currentLevel, playerId, scoreSaved, playerRank]);

  // Save score when game is over - only once per game session
  useEffect(() => {
    const saveScore = async () => {
      if (gameOver && currentScore > 0 && playerName && !scoreSaved) {
        try {
          const response = await axios.post("/api/scores", {
            name: playerName,
            score: currentScore,
            level: currentLevel,
            date: new Date(),
          });

          // Set the player ID for the current game session
          setPlayerId(response.data._id);

          // Mark the score as saved for this game session
          setScoreSaved(true);

          // Refresh scores after saving
          const scoresResponse = await axios.get("/api/scores");
          setScores(scoresResponse.data);

          // Show tooltip for name change
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 5000);
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };

    saveScore();
  }, [gameOver, currentScore, playerName, currentLevel, scoreSaved]);

  // Handler for name editing
  const handleEditName = (score: ScoreRecord) => {
    setIsEditingName(true);
    setNewName(score.name);
  };

  // Handler for name saving
  const handleSaveName = async (updatedName: string) => {
    if (playerId && updatedName.trim()) {
      try {
        await axios.put(`/api/scores/${playerId}`, { name: updatedName });

        // Update player's name for the current session
        setPlayerName(updatedName);
        setIsEditingName(false);

        // Refresh scores after updating
        const response = await axios.get("/api/scores");
        setScores(response.data);
      } catch (error) {
        console.error("Error updating name:", error);
      }
    }
  };

  // Handler for cancelling name edit
  const handleCancelEdit = () => {
    setIsEditingName(false);
  };

  return {
    displayScores,
    playerName,
    playerRank,
    isEditingName,
    newName,
    playerId,
    showTooltip,
    isRankingUp,
    handleEditName,
    handleSaveName,
    handleCancelEdit,
  };
};
