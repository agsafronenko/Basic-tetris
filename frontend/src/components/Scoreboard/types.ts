export interface ScoreRecord {
  _id?: string;
  name: string;
  score: number;
  level: number;
  date: Date;
}

export interface ScoreboardProps {
  currentScore: number;
  currentLevel: number;
  gameOver: boolean;
  gameStarted: boolean;
}

export interface ScoreTableProps {
  displayScores: ScoreRecord[];
  playerRank: number | null;
  playerId: string | null;
  playerName: string;
  isRankingUp: boolean;
  isEditingName: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  currentScore: number;
  currentLevel: number;
  handleEditName: (score: ScoreRecord) => void;
  handleSaveName: (newName: string) => void;
  handleCancelEdit: () => void;
}

export interface NameEditorProps {
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export interface PlayerStatsProps {
  playerRank: number;
  playerName: string;
  currentScore: number;
  currentLevel: number;
}
