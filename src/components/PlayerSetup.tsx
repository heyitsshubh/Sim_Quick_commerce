import { useState } from 'react';
import { UserPlus, X, Play } from 'lucide-react';
import type { Player } from '../types/game';

interface PlayerSetupProps {
  onComplete: (players: Player[]) => void;
}

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [players, setPlayers] = useState<Array<{ name: string; company: string }>>([
    { name: '', company: '' },
  ]);

  const addPlayer = () => {
    if (players.length < 10) {
      setPlayers([...players, { name: '', company: '' }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, field: 'name' | 'company', value: string) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim() && p.company.trim());
    if (validPlayers.length > 0) {
      const gamePlayers: Player[] = validPlayers.map((p, i) => ({
        id: `player-${i}`,
        name: p.name.trim(),
        company: p.company.trim(),
        score: 0,
        decisions: {},
      }));
      onComplete(gamePlayers);
    }
  };

  const canStart = players.some(p => p.name.trim() && p.company.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Player Setup</h1>
          <p className="text-slate-600">Add all players competing in this simulation</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-4 mb-6">
            {players.map((player, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Player {index + 1} Name
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={player.company}
                      onChange={(e) => updatePlayer(index, 'company', e.target.value)}
                      placeholder="e.g., QuickMart"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                {players.length > 1 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {players.length < 10 && (
              <button
                onClick={addPlayer}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Add Player
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Round 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
