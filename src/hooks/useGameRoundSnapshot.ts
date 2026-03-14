import { useEffect, useMemo, useState } from 'react';
import type { GameState } from '../types/game';

const DEFAULT_ROUND_TIMER_DURATION_SEC = 10 * 60;

const fallbackGameState: GameState = {
  currentRound: 1,
  maxRounds: 8,
  roundTimerDurationSec: DEFAULT_ROUND_TIMER_DURATION_SEC,
  roundStartedAt: null,
  players: [],
  started: false,
  finished: false,
};

const readStoredGameState = (): GameState => {
  const raw = localStorage.getItem('gameState');

  if (!raw) {
    return fallbackGameState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return {
      ...fallbackGameState,
      ...parsed,
    };
  } catch {
    return fallbackGameState;
  }
};

export default function useGameRoundSnapshot() {
  const [now, setNow] = useState(Date.now());
  const [snapshot, setSnapshot] = useState<GameState>(() => readStoredGameState());

  useEffect(() => {
    const tickInterval = window.setInterval(() => {
      setNow(Date.now());
      setSnapshot(readStoredGameState());
    }, 1000);

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'gameState' || event.key === 'activePlayerIndex') {
        setSnapshot(readStoredGameState());
      }
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(tickInterval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const activePlayerIndex = useMemo(() => {
    const storedIndex = Number(localStorage.getItem('activePlayerIndex') ?? '0');

    if (
      Number.isFinite(storedIndex) &&
      storedIndex >= 0 &&
      storedIndex < snapshot.players.length
    ) {
      return storedIndex;
    }

    return 0;
  }, [snapshot.players.length]);

  const activePlayerScore = snapshot.players[activePlayerIndex]?.score ?? 0;
  const timerDurationSec = snapshot.roundTimerDurationSec || DEFAULT_ROUND_TIMER_DURATION_SEC;

  const timeLeftSec = useMemo(() => {
    if (snapshot.finished || !snapshot.roundStartedAt) {
      return timerDurationSec;
    }

    const elapsed = Math.floor((now - new Date(snapshot.roundStartedAt).getTime()) / 1000);
    return Math.max(0, timerDurationSec - elapsed);
  }, [now, snapshot.finished, snapshot.roundStartedAt, timerDurationSec]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeftSec / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeLeftSec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timeLeftSec]);

  return {
    currentRound: snapshot.currentRound,
    maxRounds: snapshot.maxRounds,
    activePlayerScore,
    timeLeftSec,
    formattedTime,
  };
}
