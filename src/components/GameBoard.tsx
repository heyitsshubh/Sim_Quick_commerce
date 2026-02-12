import { useState } from 'react';
import { Trophy, HelpCircle } from 'lucide-react';
import type { GameState } from '../types/game';
import { ROUND_UNLOCKS } from '../data/categories';
import DecisionPanel from './DecisionPanel';
import Leaderboard from './Leaderboard';
import GameGuide from './GameGuide';
import TopNav from './TopNav';
import RoundsStrip from './RoundStrip';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGame: (state: GameState) => void;
  onFinish: () => void;
}

export default function GameBoard({
  gameState,
  onUpdateGame,
  onFinish,
}: GameBoardProps) {
  const [activePlayer, setActivePlayer] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const currentPlayer = gameState.players[activePlayer];
  const roundInfo =
    ROUND_UNLOCKS[gameState.currentRound as keyof typeof ROUND_UNLOCKS];

  const handleNextPlayer = () => {
    if (activePlayer < gameState.players.length - 1) {
      setActivePlayer(activePlayer + 1);
    } else {
      setShowLeaderboard(true);
    }
  };

  const handleNextRound = () => {
    if (gameState.currentRound < gameState.maxRounds) {
      onUpdateGame({
        ...gameState,
        currentRound: gameState.currentRound + 1,
      });
      setActivePlayer(0);
      setShowLeaderboard(false);
    } else {
      onUpdateGame({
        ...gameState,
        finished: true,
      });
      onFinish();
    }
  };

  if (showLeaderboard) {
    return (
      <Leaderboard
        players={gameState.players}
        currentRound={gameState.currentRound}
        onNextRound={handleNextRound}
        isGameOver={gameState.currentRound === gameState.maxRounds}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {showGuide && <GameGuide onClose={() => setShowGuide(false)} />}

      <div className="max-w-7xl mx-auto py-4">
        <TopNav />
        
        {/* ROUNDS HEADER */}
        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">
                Round {gameState.currentRound} of {gameState.maxRounds}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {roundInfo?.title}: {roundInfo?.description}
              </p>

              <div className="mt-3">
                <RoundsStrip currentRound={gameState.currentRound} maxRounds={gameState.maxRounds} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">
                  {currentPlayer.score} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            

            <div className="flex gap-2">
              {gameState.players.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === activePlayer
                      ? 'bg-blue-600'
                      : i < activePlayer
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div> */}

        <DecisionPanel
          player={currentPlayer}
          round={gameState.currentRound}
          onComplete={handleNextPlayer}
          onUpdatePlayer={(updated) => {
            const updatedPlayers = [...gameState.players];
            updatedPlayers[activePlayer] = updated;

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
