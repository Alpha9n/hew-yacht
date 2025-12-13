import { createContext, useContext, useState, useCallback } from 'react';
import { HandJudge } from '../utils/handJudge';
import {
  rollDice,
  moveDiceToHand,
  moveDiceToField,
  moveAllDiceToHand,
  calculatePlayerScore,
  isGameOver,
  createInitialScores,
} from '../utils/gameLogic';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Game state - designed for multiplayer support
  const [gameMode, setGameMode] = useState('local'); // 'local' or 'online'
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [turnNum, setTurnNum] = useState(1);
  const [rollRemain, setRollRemain] = useState(3);

  // Dice state
  const [hand, setHand] = useState([0, 0, 0, 0, 0]);
  const [field, setField] = useState([0, 0, 0, 0, 0]);

  // Player scores - structured for easy multiplayer extension
  const [player1Scores, setPlayer1Scores] = useState(createInitialScores());
  const [player2Scores, setPlayer2Scores] = useState(createInitialScores());

  // Temporary scores for preview
  const [tempScores, setTempScores] = useState({});

  // Game status
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);

  // Initialize game
  const startGame = useCallback((mode = 'local') => {
    setGameMode(mode);
    setCurrentPlayer(1);
    setTurnNum(1);
    setRollRemain(3);
    setHand([0, 0, 0, 0, 0]);
    setField([0, 0, 0, 0, 0]);
    setPlayer1Scores(createInitialScores());
    setPlayer2Scores(createInitialScores());
    setTempScores({});
    setGameStarted(true);
    setGameEnded(false);
    setWinner(null);
  }, []);

  // Calculate temporary scores
  const calculateTempScores = useCallback(() => {
    const allDice = [...hand, ...field].filter((d) => d !== 0);
    if (allDice.length > 0) {
      const judge = new HandJudge(allDice);
      const scores = judge.getAllHand();
      setTempScores(scores);
    }
  }, [hand, field]);

  // Roll dice
  const handleRollDice = useCallback(() => {
    if (rollRemain <= 0) return;

    const newField = rollDice(field, rollRemain);
    setField(newField);
    setRollRemain((prev) => prev - 1);

    // If last roll, move all to hand
    if (rollRemain === 1) {
      const result = moveAllDiceToHand(hand, newField);
      setHand(result.hand);
      setField(result.field);
    }
  }, [field, rollRemain, hand]);

  // Move dice between hand and field
  const handleMoveDiceToHand = useCallback(
    (index) => {
      const result = moveDiceToHand(hand, field, index);
      setHand(result.hand);
      setField(result.field);
    },
    [hand, field]
  );

  const handleMoveDiceToField = useCallback(
    (index) => {
      const result = moveDiceToField(hand, field, index);
      setHand(result.hand);
      setField(result.field);
    },
    [hand, field]
  );

  // Register score
  const registerScore = useCallback(
    (handName) => {
      const currentScores =
        currentPlayer === 1 ? player1Scores : player2Scores;
      const setScores = currentPlayer === 1 ? setPlayer1Scores : setPlayer2Scores;

      // Check if already scored
      if (currentScores[handName] !== null) return;

      // Check if dice have been rolled
      if (rollRemain >= 3) return;

      // Set score
      const score = tempScores[handName] || 0;
      setScores((prev) => ({
        ...prev,
        [handName]: score,
      }));

      // Reset for next turn
      setHand([0, 0, 0, 0, 0]);
      setField([0, 0, 0, 0, 0]);
      setRollRemain(3);
      setTempScores({});

      // Switch player or advance turn
      if (currentPlayer === 1) {
        setCurrentPlayer(2);
      } else {
        setCurrentPlayer(1);
        const newTurnNum = turnNum + 1;
        setTurnNum(newTurnNum);

        // Check game over
        const updatedP2Scores = { ...player2Scores, [handName]: score };
        if (isGameOver(player1Scores, updatedP2Scores)) {
          endGame();
        }
      }
    },
    [currentPlayer, player1Scores, player2Scores, rollRemain, tempScores, turnNum]
  );

  // End game
  const endGame = useCallback(() => {
    const p1Result = calculatePlayerScore(player1Scores);
    const p2Result = calculatePlayerScore(player2Scores);

    let gameWinner = null;
    if (p1Result.total > p2Result.total) {
      gameWinner = 'player1';
    } else if (p2Result.total > p1Result.total) {
      gameWinner = 'player2';
    } else {
      gameWinner = 'draw';
    }

    setWinner(gameWinner);
    setGameEnded(true);
  }, [player1Scores, player2Scores]);

  const value = {
    // State
    gameMode,
    currentPlayer,
    turnNum,
    rollRemain,
    hand,
    field,
    player1Scores,
    player2Scores,
    tempScores,
    gameStarted,
    gameEnded,
    winner,
    // Actions
    startGame,
    handleRollDice,
    handleMoveDiceToHand,
    handleMoveDiceToField,
    registerScore,
    calculateTempScores,
    endGame,
    // Utility
    getPlayerScore: (player) =>
      calculatePlayerScore(player === 1 ? player1Scores : player2Scores),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
