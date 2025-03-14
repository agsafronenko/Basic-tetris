// Utils for managing Tetris audio playback and settings

import { useRef, useEffect } from "react";
import { AudioRefs } from "./types";

// Audio file paths
const AUDIO_PATHS = {
  theme: "/sounds/audioTheme.wav",
  pause: "/sounds/pause.wav",
  levelUp: "/sounds/level-up.wav",
  rowClear: "/sounds/rowClear.wav",
  gameOver: "/sounds/game-over.wav",
};

export const useAudio = () => {
  // Refs for audio elements
  const audioRefs = useRef<AudioRefs>({
    themeAudio: null,
    pauseAudio: null,
    levelUpAudio: null,
    rowClearAudio: null,
    gameOverAudio: null,
  });

  // Track previous level for level-up sound
  const previousLevelRef = useRef<number>(1);

  // Initialize audio on mount, cleanup on unmount
  useEffect(() => {
    const currentAudioRefs = audioRefs.current;

    currentAudioRefs.themeAudio = new Audio(AUDIO_PATHS.theme);
    currentAudioRefs.themeAudio.loop = true;
    currentAudioRefs.pauseAudio = new Audio(AUDIO_PATHS.pause);
    currentAudioRefs.levelUpAudio = new Audio(AUDIO_PATHS.levelUp);
    currentAudioRefs.rowClearAudio = new Audio(AUDIO_PATHS.rowClear);
    currentAudioRefs.gameOverAudio = new Audio(AUDIO_PATHS.gameOver);

    return () => {
      // Cleanup: pause and nullify audio
      if (currentAudioRefs.themeAudio) {
        currentAudioRefs.themeAudio.pause();
        currentAudioRefs.themeAudio = null;
      }
      currentAudioRefs.pauseAudio = null;
      currentAudioRefs.levelUpAudio = null;
      currentAudioRefs.rowClearAudio = null;
      currentAudioRefs.gameOverAudio = null;
    };
  }, []);

  // Control theme music based on game state
  const updateThemeMusicPlayback = (gameStarted: boolean, isPaused: boolean, gameOver: boolean, isMuted: boolean) => {
    const { themeAudio } = audioRefs.current;
    if (themeAudio) {
      if (gameStarted && !isPaused && !gameOver && !isMuted) {
        themeAudio.play().catch((e) => console.error("Audio play failed:", e));
      } else {
        themeAudio.pause();
      }
    }
  };

  // Mute/unmute all audio
  const updateMuteState = (isMuted: boolean) => {
    const { themeAudio, pauseAudio, levelUpAudio, rowClearAudio, gameOverAudio } = audioRefs.current;

    if (themeAudio) themeAudio.muted = isMuted;
    if (pauseAudio) pauseAudio.muted = isMuted;
    if (levelUpAudio) levelUpAudio.muted = isMuted;
    if (rowClearAudio) rowClearAudio.muted = isMuted;
    if (gameOverAudio) gameOverAudio.muted = isMuted;
  };

  // Set volume for all audio
  const updateVolume = (soundLevel: number) => {
    const { themeAudio, pauseAudio, levelUpAudio, rowClearAudio, gameOverAudio } = audioRefs.current;

    if (themeAudio) themeAudio.volume = soundLevel;
    if (pauseAudio) pauseAudio.volume = soundLevel;
    if (levelUpAudio) levelUpAudio.volume = soundLevel;
    if (rowClearAudio) rowClearAudio.volume = soundLevel;
    if (gameOverAudio) gameOverAudio.volume = soundLevel;
  };

  // Adjust theme music speed and play level-up sound
  const updateThemeMusicSpeed = (level: number, isMuted: boolean, gameStarted: boolean) => {
    const { themeAudio, levelUpAudio } = audioRefs.current;
    if (themeAudio && level > 1) {
      // Increase playback rate by 10% per level, up to a maximum 200%
      const newRate = Math.min(2, 1 + (level - 1) * 0.1);
      themeAudio.playbackRate = newRate;

      if (!isMuted && levelUpAudio && gameStarted && level > previousLevelRef.current) {
        levelUpAudio.currentTime = 0;
        levelUpAudio.play().catch((e) => console.error("Level up audio play failed:", e));
      }
    }
    previousLevelRef.current = level;
  };

  // Play specific sound effects
  const playSoundEffect = (sound: "pause" | "rowClear" | "gameOver", isMuted: boolean, gameStarted: boolean = true) => {
    if (isMuted) return;

    const audioMap = {
      pause: audioRefs.current.pauseAudio,
      rowClear: audioRefs.current.rowClearAudio,
      gameOver: audioRefs.current.gameOverAudio,
    };

    const audio = audioMap[sound];

    if (audio && (!["rowClear", "gameOver"].includes(sound) || gameStarted)) {
      audio.play().catch((e) => console.error(`${sound} audio play failed:`, e));
    }
  };

  // Reset theme music to default speed
  const resetThemeMusic = () => {
    if (audioRefs.current.themeAudio) {
      audioRefs.current.themeAudio.playbackRate = 1.0;
      previousLevelRef.current = 1;
    }
  };

  return {
    updateThemeMusicPlayback,
    updateMuteState,
    updateVolume,
    updateThemeMusicSpeed,
    playSoundEffect,
    resetThemeMusic,
  };
};
