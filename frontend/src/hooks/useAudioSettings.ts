// Custom hook for managing Tetris game audio settings and controls
import { useState } from "react";
import { useAudio } from "../utils/audioUtils";

export const useAudioSettings = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0.2);

  // Import audio control functions
  const { updateThemeMusicPlayback, updateMuteState, updateVolume, updateThemeMusicSpeed, playSoundEffect, resetThemeMusic } = useAudio();

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return {
    isMuted, // Current mute state
    soundLevel, // Current volume level (0-1)
    setSoundLevel, // Function to update volume
    toggleMute, // Function to toggle mute state
    updateThemeMusicPlayback, // Plays/pauses theme music
    updateMuteState, // Updates mute status in audio utils
    updateVolume, // Sets new volume level
    updateThemeMusicSpeed, // Adjusts music speed by game level
    playSoundEffect, // Triggers sound effects
    resetThemeMusic, // Resets theme music to start
  };
};
