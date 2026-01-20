import { useState } from 'react';
import { Trophy, ChevronRight, Lock, Unlock, HelpCircle } from 'lucide-react';
import type { Player, GameState } from '../types/game';
import { ROUND_UNLOCKS } from '../data/categories';
import DecisionPanel from './DecisionPanel';
import Leaderboard from './Leaderboard';
import GameGuide from './GameGuide';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGame: (state: GameState) => void;
  onFinish: () => void;
}

export default function GameBoard({ gameState, onUpdateGame, onFinish }: GameBoardProps) {
  const [activePlayer, setActivePlayer] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const currentPlayer = gameState.players[activePlayer];
  const roundInfo = ROUND_UNLOCKS[gameState.currentRound as keyof typeof ROUND_UNLOCKS];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {showGuide && <GameGuide onClose={() => setShowGuide(false)} />}

      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Round {gameState.currentRound} of {gameState.maxRounds}</h1>
              <p className="text-slate-600">{roundInfo?.title}: {roundInfo?.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-all"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">{currentPlayer.score} pts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Array.from({ length: gameState.maxRounds }, (_, i) => i + 1).map((round) => (
              <div
                key={round}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  round === gameState.currentRound
                    ? 'bg-blue-600 text-white'
                    : round < gameState.currentRound
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {round < gameState.currentRound ? (
                  <Unlock className="w-4 h-4" />
                ) : round === gameState.currentRound ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Round {round}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {currentPlayer.name} - {currentPlayer.company}
              </h2>
              <p className="text-sm text-slate-600">
                Player {activePlayer + 1} of {gameState.players.length}
              </p>
            </div>
            <div className="flex gap-2">
              {gameState.players.map((p, i) => (
                <div
                  key={p.id}
                  className={`w-3 h-3 rounded-full ${
                    i === activePlayer ? 'bg-blue-600' : i < activePlayer ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

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
