/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { LogIn, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Player } from "../types/game";

interface PlayerSetupProps {
  onComplete: (players: Player[]) => void;
}

type Simulation = {
  _id: string;
  name: string;
};

type Group = {
  _id: string;
  name: string;
};

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const navigate = useNavigate();

  // Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Dropdown data
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Selected
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/auth/login",
        { username, password }
      );

      const { token, userId, simulationId, groupId } = res.data;

      localStorage.setItem("jwt", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("simulationId", simulationId);
      localStorage.setItem("groupId", groupId);

      setSelectedSimulation(simulationId);
      setSelectedGroup(groupId);
      setLoggedIn(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔽 FETCH SIMULATIONS
  useEffect(() => {
    if (!loggedIn) return;

    const fetchSimulations = async () => {
      const { data } = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/simulation/list"
      );
      setSimulations(data);
    };

    fetchSimulations();
  }, [loggedIn]);

  // 🔽 FETCH GROUPS (BASED ON SIMULATION)
  useEffect(() => {
    if (!selectedSimulation) return;

    const fetchGroups = async () => {
      const { data } = await axios.get(
        `https://sim-quick-commerce-backend.onrender.com/api/group/by-simulation/${selectedSimulation}`
      );
      setGroups(data);
    };

    fetchGroups();
  }, [selectedSimulation]);

  // ▶️ START GAME
  const handleStartGame = () => {
    const player: Player = {
      id: "player-1",
      name: username,
      company: "Group",
      score: 0,
      decisions: {},
    };

    onComplete([player]);
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Simulation Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {!loggedIn && (
          <div className="space-y-4">
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
              onClick={handleLogin}
              disabled={loading || !username || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* SIMULATION & GROUP (AFTER LOGIN) */}
        {loggedIn && (
          <div className="space-y-4 mt-6">
            <select
              value={selectedSimulation}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-slate-100"
            >
              {simulations.map((sim) => (
                <option key={sim._id} value={sim._id}>
                  {sim.name}
                </option>
              ))}
            </select>

            <select
              value={selectedGroup}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-slate-100"
            >
              {groups.map((grp) => (
                <option key={grp._id} value={grp._id}>
                  {grp.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
