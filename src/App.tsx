import { useState } from 'react';
import type { GameState } from './types/game';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';

type Screen = 'welcome' | 'setup' | 'game' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    maxRounds: 8,
    players: [],
    started: false,
    finished: false,
  });

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('setup')} />}

      {screen === 'setup' && (
        <PlayerSetup
          onComplete={(players) => {
            setGameState({
              ...gameState,
              players,
              started: true,
            });
            setScreen('game');
          }}
        />
      )}

      {screen === 'game' && (
        <GameBoard
          gameState={gameState}
          onUpdateGame={setGameState}
          onFinish={() => setScreen('results')}
        />
      )}

      {screen === 'results' && (
        <Leaderboard
          players={gameState.players}
          currentRound={gameState.currentRound}
          onNextRound={() => {}}
          isGameOver={true}
        />
      )}
    </>
  );
}

export default App;
