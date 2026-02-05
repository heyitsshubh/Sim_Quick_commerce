import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { GameState } from './types/game';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import Profile from './routes/Profile';
import BusinessPlan from './routes/BusinessPlan';
import Decisions from './routes/Decisions';
import Analysis from './routes/Analysis';
import Communication from './routes/Communication';
import Results from './routes/Results';
import { useState, useEffect } from 'react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    maxRounds: 8,
    players: [],
    started: false,
    finished: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState);
        setGameState(parsedState);
      } catch (err) {
        console.error('Failed to parse saved game state:', err);
      }
    }
    setIsLoading(false);
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [gameState, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        
        <Route 
          path="/setup" 
          element={
            <PlayerSetup
              onComplete={(players) => {
                setGameState(prev => ({
                  ...prev,
                  players,
                  started: true,
                }));
              }}
            />
          } 
        />
        
        <Route 
          path="/game" 
          element={
            gameState.started ? (
              <GameBoard
                gameState={gameState}
                onUpdateGame={setGameState}
                onFinish={() => {
                  setGameState(prev => ({ ...prev, finished: true }));
                }}
              />
            ) : (
              <Navigate to="/setup" replace />
            )
          } 
        />
        
        <Route 
          path="/decisions" 
          element={
            gameState.finished ? (
              <Leaderboard 
                players={gameState.players}
                currentRound={gameState.currentRound}
                onNextRound={() => {
                  setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
                }}
                isGameOver={gameState.finished}
              />
            ) : (
              <Navigate to="/game" replace />
            )
          } 
        />
 
        <Route path="/profile" element={<Profile />} />
        <Route path="/business-plan" element={<BusinessPlan />} />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/analysis/category/:categoryId/:segment" element={<Analysis />} />
        <Route path="/analysis/category/:categoryId" element={<Analysis />} />
        <Route path="/analysis/:segment" element={<Analysis />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/results" element={<Results />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;