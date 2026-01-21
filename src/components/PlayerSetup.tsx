/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Play, LogIn } from 'lucide-react';
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

  const [isLogin, setIsLogin] = useState(false);
  const [simName, setSimName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create Simulation
      const simRes = await createSimulation(simName, 8);
      const simulationId = simRes._id || simRes.data?._id;

      if (!simulationId) {
        throw new Error('Failed to create simulation');
      }

      // Step 2: Create Group
      const groupRes = await createGroup(groupName, simulationId);
      const groupId = groupRes._id || groupRes.data?._id;

      if (!groupId) {
        throw new Error('Failed to create group');
      }

      // Step 3: Create User
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
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://sim-quick-commerce-backend.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login Response:', data);

      const token = data.token || data.data?.token;
      if (token) {
        localStorage.setItem('jwt', token);
      }

      const userId =
        data.user?._id ||
        data.data?.user?._id ||
        data._id ||
        data.data?._id ||
        data.userId ||
        data.data?.userId;

      if (userId) {
        localStorage.setItem('userId', userId);
      }

      const simulationId = data.simulationId || data.data?.simulationId;
      if (simulationId) {
        localStorage.setItem('simulationId', simulationId);
      }

      const player: Player = {
        id: 'player-1',
        name: data.user?.name || username,
        company: data.user?.company || 'Company',
        score: 0,
        decisions: {},
      };

      onComplete([player]);
      navigate('/game');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSignup =
    simName.trim() &&
    groupName.trim() &&
    username.trim() &&
    password.trim();

  const canLogin = username.trim() && password.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Tab Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setUsername('');
              setPassword('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              !isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setSimName('');
              setGroupName('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Login
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        {!isLogin && (
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">Simulation Setup</h1>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Simulation Name
              </label>
              <input
                placeholder="Enter simulation name"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Group Name
              </label>
              <input
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              disabled={!canSignup || loading}
              onClick={handleSignup}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-5 h-5" />
              {loading ? 'Creating...' : 'Start Round 1'}
            </button>
          </div>
        )}

        {/* Login Form */}
        {isLogin && (
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">Login</h1>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              disabled={!canLogin || loading}
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}