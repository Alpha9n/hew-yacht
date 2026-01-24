import { useGame } from '../contexts/GameContext';
import { BONUS_BORDER, BONUS_POINT } from '../utils/gameLogic';

const ScoreBoard = () => {
  const {
    currentPlayer,
    player1Scores,
    player2Scores,
    tempScores,
    rollRemain,
    registerScore,
    getPlayerScore,
  } = useGame();

  const p1Result = getPlayerScore(1);
  const p2Result = getPlayerScore(2);

  const hands = [
    { id: 'ace', name: 'エース', icon: 'fa-dice-one' },
    { id: 'deuce', name: 'デュース', icon: 'fa-dice-two' },
    { id: 'tray', name: 'トレイ', icon: 'fa-dice-three' },
    { id: 'four', name: 'フォー', icon: 'fa-dice-four' },
    { id: 'five', name: 'ファイブ', icon: 'fa-dice-five' },
    { id: 'six', name: 'シックス', icon: 'fa-dice-six' },
  ];

  const specialHands = [
    { id: 'choice', name: 'チョイス', icon: 'fa-hand-pointer' },
    { id: 'fourDice', name: 'フォーダイス', icon: 'fa-square' },
    { id: 'fullHouse', name: 'フルハウス', icon: 'fa-star' },
    { id: 'smallStraight', name: 'S.ストレート', icon: 'fa-bolt' },
    { id: 'bigStraight', name: 'B.ストレート', icon: 'fa-v' },
    { id: 'yacht', name: 'ヨット', icon: 'fa-crown' },
  ];

  const handleScoreClick = (handId, player) => {
    if (currentPlayer !== player) return;
    registerScore(handId);
  };

  const renderScoreCell = (handId, player) => {
    const scores = player === 1 ? player1Scores : player2Scores;
    const isActive = currentPlayer === player;
    const score = scores[handId];
    const tempScore = tempScores[handId];

    let displayValue = '';
    let className = `player${player} scoreSlot`;

    if (isActive) {
      className += ' active';
    }

    if (score !== null) {
      displayValue = score;
    } else if (isActive && tempScore !== undefined && rollRemain < 3) {
      displayValue = tempScore;
      className += ' tempSlot';
    }

    return (
      <td
        className={className}
        onClick={() => handleScoreClick(handId, player)}
      >
        {displayValue}
      </td>
    );
  };

  return (
    <div id="scoreBoard">
      <table id="simpleHand">
        <tbody>
          <tr className="title">
            <td className="hand">役名</td>
            <td className="playerName1">Player 1</td>
            <td className="playerName2">Player 2</td>
          </tr>
          {hands.map((hand) => (
            <tr key={hand.id} id={hand.id}>
              <td className="hand">
                <i className={`fa-solid ${hand.icon}`}></i>
                {hand.name}
              </td>
              {renderScoreCell(hand.id, 1)}
              {renderScoreCell(hand.id, 2)}
            </tr>
          ))}
          <tr id="bonusResult" className="title">
            <td className="total hand">
              小計
              <br />
              ボーナス+35
            </td>
            <td className={`player1 bonus`}>
              {p1Result.hasBonus
                ? `+${BONUS_POINT}`
                : `${p1Result.simpleHandTotal} / ${BONUS_BORDER}`}
            </td>
            <td className={`player2 bonus`}>
              {p2Result.hasBonus
                ? `+${BONUS_POINT}`
                : `${p2Result.simpleHandTotal} / ${BONUS_BORDER}`}
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <i className="fa-solid fa-dice-one"></i>~
        <i className="fa-solid fa-dice-six"></i>
        の合計スコアが63点以上でボーナス獲得
      </p>
      <table>
        <tbody>
          <tr id="choice">
            <td className="hand">
              <i className="fa-solid fa-hand-pointer"></i>
              チョイス
            </td>
            {renderScoreCell('choice', 1)}
            {renderScoreCell('choice', 2)}
          </tr>
        </tbody>
      </table>
      <table id="specialHand">
        <tbody>
          {specialHands.slice(1).map((hand) => (
            <tr key={hand.id} id={hand.id}>
              <td className="hand">
                <i className={`fa-solid ${hand.icon}`}></i>
                {hand.name}
              </td>
              {renderScoreCell(hand.id, 1)}
              {renderScoreCell(hand.id, 2)}
            </tr>
          ))}
          <tr id="totalResult" className="title">
            <td className="total hand">得点</td>
            <td className="player1 totalScore">{p1Result.total}</td>
            <td className="player2 totalScore">{p2Result.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBoard;
