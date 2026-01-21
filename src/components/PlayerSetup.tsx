/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Player } from '../types/game';
import {
  createSimulation,
  createGroup,
  createUser,
} from '../api/simulation';

interface PlayerSetupProps {
  onComplete: (players: Player[]) => void;
}

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const navigate = useNavigate();

  const [simName, setSimName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);

      const simRes = await createSimulation(simName, 3);
      const simulationId = simRes._id || simRes.data?._id;

      if (!simulationId) {
        throw new Error('Failed to create simulation');
      }

      const groupRes = await createGroup(groupName, simulationId);
      const groupId = groupRes._id || groupRes.data?._id;

      if (!groupId) {
        throw new Error('Failed to create group');
      }

             const userRes = await createUser(username, password, simulationId, groupId);
      
      console.log('User Response:', userRes);
      
      const token =
        (userRes as any)?.token ||
        (userRes as any)?.data?.token;

      if (token) {
        localStorage.setItem('jwt', token);
      }

      const userId = 
        (userRes as any)?.user?._id ||
        (userRes as any)?.data?.user?._id ||
        (userRes as any)?._id || 
        (userRes as any)?.data?._id ||
        (userRes as any)?.userId ||
        (userRes as any)?.data?.userId;
      
      console.log('Extracted userId:', userId);
      
      if (userId) {
        localStorage.setItem('userId', userId);
      } else {
        console.error('Could not find userId in response');
      }
      
      if (simulationId) {
        localStorage.setItem('simulationId', simulationId);
      }
      const player: Player = {
        id: 'player-1',
        name: simName,
        company: groupName,
        score: 0,
        decisions: {},
      };

      onComplete([player]);
      navigate('/game');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canStart =
    simName.trim() &&
    groupName.trim() &&
    username.trim() &&
    password.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-5">
        <h1 className="text-3xl font-bold text-center">Simulation Setup</h1>

        <input
          placeholder="Simulation Name"
          value={simName}
          onChange={(e) => setSimName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          disabled={!canStart || loading}
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          <Play className="w-5 h-5" />
          {loading ? 'Starting...':'Start Round 1'}
        </button>
      </div>
    </div>
  );
}
