import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import ScoreBoard from '../components/ScoreBoard';
import DiceArea from '../components/DiceArea';
import TurnInfo from '../components/TurnInfo';
import ResultScreen from '../components/ResultScreen';
import '../styles/Game.css';
import '../styles/particle.css';

const Game = () => {
  const [searchParams] = useSearchParams();
  const { startGame, calculateTempScores, gameStarted, gameEnded, hand, field } = useGame();

  useEffect(() => {
    const mode = searchParams.get('mode') || 'local';
    startGame(mode);
  }, [searchParams, startGame]);

  useEffect(() => {
    if (gameStarted) {
      calculateTempScores();
    }
  }, [hand, field, gameStarted, calculateTempScores]);

  return (
    <div id="game">
      <div id="dataSection">
        <h2>得点表</h2>
        <ScoreBoard />
      </div>
      <div id="gameSection">
        <DiceArea />
        <TurnInfo />
      </div>
      {gameEnded && <ResultScreen />}
    </div>
  );
};

export default Game;
