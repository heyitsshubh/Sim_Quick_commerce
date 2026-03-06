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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const canLogin = username.trim() && password.trim();
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
      if (simulationId) {
        localStorage.setItem("simulationId", simulationId);
        setSelectedSimulation(simulationId);
      }
      if (groupId) {
        localStorage.setItem("groupId", groupId);
        setSelectedGroup(groupId);
      }

      setLoggedIn(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const { data } = await axios.get(
          "https://sim-quick-commerce-backend.onrender.com/api/simulation/list"
        );
        setSimulations(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error("Failed to load simulations", e);
      }
    };
    fetchSimulations();
  }, []);
  useEffect(() => {
    if (!selectedSimulation) {
      setGroups([]);
      setSelectedGroup("");
      return;
    }

    const fetchGroups = async () => {
      try {
        const { data } = await axios.get(
          `https://sim-quick-commerce-backend.onrender.com/api/group/by-simulation/${selectedSimulation}`
        );
        setGroups(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error("Failed to load groups", e);
        setGroups([]);
      }
    };
    fetchGroups();
  }, [selectedSimulation]);
  const handleStartGame = () => {
    const selectedGroupObj = groups.find((g) => g._id === selectedGroup);
    const player: Player = {
      id: "player-1",
      name: username,
      company: selectedGroupObj?.name || "Group",
      score: 0,
      decisions: {},
    };

    onComplete([player]);
    navigate("/decisions", { replace: true });
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
        {!loggedIn && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canLogin) handleLogin();
            }}
          >
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
              type="submit"
              disabled={loading || !canLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
        {loggedIn && (
          <div className="space-y-4 mt-6">
            <select
              value={selectedSimulation}
              onChange={(e) => {
                const simId = e.target.value;
                setSelectedSimulation(simId);
                localStorage.setItem("simulationId", simId);
              }}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Select Simulation --</option>
              {simulations.map((sim) => (
                <option key={sim._id} value={sim._id}>
                  {sim.name}
                </option>
              ))}
            </select>

            <select
              value={selectedGroup}
              onChange={(e) => {
                const grpId = e.target.value;
                setSelectedGroup(grpId);
                localStorage.setItem("groupId", grpId);
              }}
              disabled={!selectedSimulation}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-slate-100"
            >
              <option value="">-- Select Group --</option>
              {groups.map((grp) => (
                <option key={grp._id} value={grp._id}>
                  {grp.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartGame}
              disabled={!selectedSimulation || !selectedGroup}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white py-3 rounded-xl flex items-center justify-center gap-2"
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