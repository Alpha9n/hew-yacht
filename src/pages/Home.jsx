import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="wrapper">
      <div className="filter">
        <div className="menu">
          <Link to="/">
            <h1 className="title">
              <i className="fa-solid fa-dice"></i> ヨット
            </h1>
          </Link>
          <ul className="gameMode">
            <li>
              <Link to="/game?mode=local" className="button">
                <i className="fa-solid fa-leaf"></i> 練習モード
              </Link>
            </li>
            <li>
              <a href="#" className="comingsoon button disabled">
                <i className="fa-solid fa-square-plus"></i> ルームを作成
              </a>
            </li>
            <li>
              <a href="#" className="comingsoon button disabled">
                <i className="fa-solid fa-right-to-bracket"></i> ルームに参加
              </a>
            </li>
            <li>
              <a href="#" className="comingsoon button disabled">
                <i className="fa-solid fa-gear"></i> 設定
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
