import { useGame } from '../contexts/GameContext';

const TurnInfo = () => {
  const { turnNum, currentPlayer } = useGame();

  return (
    <div id="turnData">
      <div className="leftContent">
        <h2>ラウンド</h2>
        <p>
          <span id="turnNum">{turnNum}</span>/12
        </p>
      </div>
      <div className="rightContent">
        <p>
          Player<span id="playerTurn">{currentPlayer}</span>の<br />
          ターン
        </p>
      </div>
    </div>
  );
};

export default TurnInfo;
