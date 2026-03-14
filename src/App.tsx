import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { GameState } from './types/game';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSetup from './components/PlayerSetup';
import Profile from './routes/Profile';
import BusinessPlan from './routes/BusinessPlan';
import Decisions from './routes/Decisions';
import Analysis from './routes/Analysis';
import Communication from './routes/Communication';
import Results from './routes/Results';
import { useState, useEffect } from 'react';

const DEFAULT_ROUND_TIMER_DURATION_SEC = 10 * 60;

const getDefaultGameState = (): GameState => ({
  currentRound: 1,
  maxRounds: 8,
  roundTimerDurationSec: DEFAULT_ROUND_TIMER_DURATION_SEC,
  roundStartedAt: null,
  players: [],
  started: false,
  finished: false,
});

function App() {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState);
        setGameState({
          ...getDefaultGameState(),
          ...parsedState,
        });
      } catch (err) {
        console.error('Failed to parse saved game state:', err);
      }
    }
    setIsLoading(false);
  }, []);
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
            gameState.started ? (
              <Navigate to="/decisions" replace />
            ) : (
              <PlayerSetup
                onComplete={(players) => {
                  setGameState(prev => ({
                    ...prev,
                    players,
                    started: true,
                  }));
                }}
              />
            )
          } 
        />
        
        <Route 
          path="/game" 
          element={<Navigate to="/decisions" replace />} 
        />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/business-plan" element={<BusinessPlan />} />
        <Route
          path="/decisions"
          element={
            gameState.started ? (
              <Decisions gameState={gameState} onUpdateGame={setGameState} />
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
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