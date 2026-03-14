import { HelpCircle, Timer, Trophy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameState } from '../types/game';
import TopNav from '../components/TopNav';
import RoundsStrip from '../components/RoundStrip';
import DecisionPanel from '../components/DecisionPanel';

const DEFAULT_ROUND_TIMER_DURATION_SEC = 10 * 60;

interface DecisionsProps {
  gameState: GameState;
  onUpdateGame: (state: GameState) => void;
}

export default function Decisions({ gameState, onUpdateGame }: DecisionsProps) {
  const [now, setNow] = useState(Date.now());
  const didAutoAdvanceRef = useRef<number | null>(null);

  const storedIndex = Number(localStorage.getItem('activePlayerIndex') ?? '0');
  const activePlayerIndex =
    Number.isFinite(storedIndex) && storedIndex >= 0 && storedIndex < gameState.players.length
      ? storedIndex
      : 0;
  const currentPlayer = gameState.players[activePlayerIndex];

  const roundTimerDurationSec = gameState.roundTimerDurationSec || DEFAULT_ROUND_TIMER_DURATION_SEC;

  useEffect(() => {
    if (gameState.finished) return;

    if (!gameState.roundStartedAt) {
      onUpdateGame({
        ...gameState,
        roundStartedAt: new Date().toISOString(),
      });
    }
  }, [gameState, onUpdateGame]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const timeLeftSec = useMemo(() => {
    if (!gameState.roundStartedAt || gameState.finished) {
      return roundTimerDurationSec;
    }

    const elapsedSec = Math.floor((now - new Date(gameState.roundStartedAt).getTime()) / 1000);
    return Math.max(0, roundTimerDurationSec - elapsedSec);
  }, [gameState.finished, gameState.roundStartedAt, now, roundTimerDurationSec]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeftSec / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeLeftSec % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }, [timeLeftSec]);

  const handleAdvanceRound = useCallback(() => {
    if (gameState.finished) return;

    if (gameState.currentRound < gameState.maxRounds) {
      onUpdateGame({
        ...gameState,
        currentRound: gameState.currentRound + 1,
        roundStartedAt: new Date().toISOString(),
      });
      return;
    }

    onUpdateGame({
      ...gameState,
      finished: true,
    });
  }, [gameState, onUpdateGame]);

  useEffect(() => {
    if (gameState.finished || timeLeftSec > 0) {
      return;
    }

    if (didAutoAdvanceRef.current === gameState.currentRound) {
      return;
    }

    didAutoAdvanceRef.current = gameState.currentRound;
    handleAdvanceRound();
  }, [gameState.currentRound, gameState.finished, handleAdvanceRound, timeLeftSec]);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">No player found. Please complete setup first.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <TopNav />

        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Round {gameState.currentRound} of {gameState.maxRounds}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">Make and save all decisions for this round.</p>

              <div className="mt-3 overflow-x-auto">
                <RoundsStrip currentRound={gameState.currentRound} maxRounds={gameState.maxRounds} />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap bg-slate-100 text-slate-700 px-3 py-2 rounded-md">
                <Timer className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold">{formattedTime}</span>
              </div>

              <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition text-sm md:text-base">
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>

              <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">{currentPlayer.score} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <DecisionPanel
          player={currentPlayer}
          round={gameState.currentRound}
          isRoundLocked={timeLeftSec === 0 && !gameState.finished}
          timeLeftSec={timeLeftSec}
          onComplete={handleAdvanceRound}
          onUpdatePlayer={(updatedPlayer) => {
            const updatedPlayers = [...gameState.players];
            updatedPlayers[activePlayerIndex] = updatedPlayer;
            onUpdateGame({
              ...gameState,
              players: updatedPlayers,
            });
          }}
        />
      </div>
    </div>
  );
}
