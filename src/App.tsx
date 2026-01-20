import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { GameState } from './types/game';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import { useState } from 'react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    maxRounds: 8,
    players: [],
    started: false,
    finished: false,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        
        <Route 
          path="/setup" 
          element={
            <PlayerSetup
              onComplete={(players) => {
                setGameState({
                  ...gameState,
                  players,
                  started: true,
                });
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
                onFinish={() => {}}
              />
            ) : (
              <Navigate to="/setup" replace />
            )
          } 
        />
       
        <Route 
          path="/results" 
          element={
            <Leaderboard
              players={gameState.players}
              currentRound={gameState.currentRound}
              onNextRound={() => {}}
              isGameOver={true}
            />
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;