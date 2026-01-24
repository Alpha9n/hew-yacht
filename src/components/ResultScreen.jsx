import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const ResultScreen = () => {
  const { winner, getPlayerScore } = useGame();

  const p1Result = getPlayerScore(1);
  const p2Result = getPlayerScore(2);

  const getResultTitle = () => {
    if (winner === 'player1') return 'Player1の勝ち';
    if (winner === 'player2') return 'Player2の勝ち';
    return 'DRAW / 引き分け';
  };

  const modalContent = (
    <>
      <div className="result-overlay" />
      <div id="resultScreen" className="show">
        <div className="result">
          <h2>結果</h2>
          <p className="resultTitle">{getResultTitle()}</p>
          <div className="winorlose">
            <div className={`player1 ${winner === 'player1' ? 'winner' : 'loser'}`}>
              <i className="fa-solid fa-crown"></i>
              <div className="icon"></div>
              <p className="name">Player1</p>
              <p className="point">{p1Result.total}点</p>
            </div>
            <div className={`player2 ${winner === 'player2' ? 'winner' : 'loser'}`}>
              <i className="fa-solid fa-crown"></i>
              <div className="icon"></div>
              <p className="name">Player2</p>
              <p className="point">{p2Result.total}点</p>
            </div>
          </div>

          <ul>
            <li>
              <Link to="/game?mode=local">
                <i className="fa-solid fa-rotate-left"></i>
                もう一度ゲームをプレイ
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fa-solid fa-house"></i>
                ホームに戻る
              </Link>
            </li>
          </ul>
        </div>
        {winner !== 'draw' && (
          <div className="confetti show">
            {[...Array(50)].map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ResultScreen;
