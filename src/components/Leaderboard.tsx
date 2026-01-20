import { useState } from 'react';
import { Trophy, Medal, ChevronRight, Crown, BarChart3, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';
import type { Player } from '../types/game';
import AnalysisTab from './analytics/AnalysisTab';
import FinancialsTab from './analytics/FinancialsTab';
import PerformanceTab from './analytics/PerformanceTab';
import GameGuide from './GameGuide';

interface LeaderboardProps {
  players: Player[];
  currentRound: number;
  onNextRound: () => void;
  isGameOver: boolean;
}

export default function Leaderboard({ players, currentRound, onNextRound, isGameOver }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analysis' | 'financials' | 'performance'>('leaderboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setActiveTab('analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-12">
      {showGuide && <GameGuide onClose={() => setShowGuide(false)} />}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 relative">
          <button
            onClick={() => setShowGuide(true)}
            className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Game Guide</span>
          </button>

          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isGameOver ? 'Final Results!' : `Round ${currentRound} Complete!`}
          </h1>
          <p className="text-slate-600">
            {isGameOver ? 'Competition has ended. Here are the winners!' : 'Current standings'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => {
                setActiveTab('analysis');
                if (!selectedPlayer) setSelectedPlayer(sortedPlayers[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'analysis'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analysis
            </button>
            <button
              onClick={() => {
                setActiveTab('financials');
                if (!selectedPlayer) setSelectedPlayer(sortedPlayers[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'financials'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Financials
            </button>
            <button
              onClick={() => {
                setActiveTab('performance');
                if (!selectedPlayer) setSelectedPlayer(sortedPlayers[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'performance'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Performance
            </button>
          </div>
        </div>

        {activeTab !== 'leaderboard' && selectedPlayer && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Viewing data for:</label>
            <select
              value={selectedPlayer.id}
              onChange={(e) => setSelectedPlayer(players.find(p => p.id === e.target.value) || players[0])}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {sortedPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} - {player.company} ({player.score} points)
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => {
                const isWinner = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerSelect(player)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                      isWinner
                        ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300'
                        : isSecond
                        ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300'
                        : isThird
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                      {isWinner ? (
                        <Crown className="w-7 h-7 text-amber-500" />
                      ) : isSecond ? (
                        <Medal className="w-7 h-7 text-slate-500" />
                      ) : isThird ? (
                        <Medal className="w-7 h-7 text-orange-600" />
                      ) : (
                        <span className="text-lg font-bold text-slate-600">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{player.name}</h3>
                      <p className="text-sm text-slate-600">{player.company}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{player.score}</div>
                      <div className="text-sm text-slate-600">points</div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && selectedPlayer && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <AnalysisTab player={selectedPlayer} round={currentRound} allPlayers={players} />
          </div>
        )}

        {activeTab === 'financials' && selectedPlayer && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <FinancialsTab player={selectedPlayer} round={currentRound} />
          </div>
        )}

        {activeTab === 'performance' && selectedPlayer && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <PerformanceTab player={selectedPlayer} round={currentRound} />
          </div>
        )}

        {isGameOver ? (
          <div className="text-center">
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Congratulations {sortedPlayers[0].name}!
              </h2>
              <p className="text-slate-600">
                {sortedPlayers[0].company} has won the Quick Commerce Simulation with {sortedPlayers[0].score} points!
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={onNextRound}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2"
            >
              Continue to Round {currentRound + 1}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
