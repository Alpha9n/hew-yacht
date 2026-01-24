import { useGame } from '../contexts/GameContext';
import { DICE_FACE } from '../utils/gameLogic';

const DiceArea = () => {
  const {
    hand,
    field,
    rollRemain,
    handleRollDice,
    handleMoveDiceToHand,
    handleMoveDiceToField,
  } = useGame();

  const renderDice = (value) => {
    const iconClass = DICE_FACE[value] || DICE_FACE[0];
    return <i className={`fa-solid ${iconClass}`}></i>;
  };

  return (
    <>
      <div id="determinedDice">
        <h2>手持ちのサイコロ</h2>
        <p>※クリックでふりなおす</p>
        <ul className="dices">
          {hand.map((dice, index) => (
            <li
              key={index}
              className="diceSlot"
              onClick={() => handleMoveDiceToField(index)}
            >
              {renderDice(dice)}
            </li>
          ))}
        </ul>
      </div>
      <div id="diceRoll">
        <ul id="randomDices">
          {field.map((dice, index) => (
            <li
              key={index}
              className="diceSlot"
              onClick={() => handleMoveDiceToHand(index)}
            >
              {renderDice(dice)}
            </li>
          ))}
        </ul>
        <div className="rollButton" onClick={handleRollDice}>
          <i className="fa-solid fa-dice"></i>
          <p>
            サイコロを振る <br />
            <span className="rollCount">
              あと<span className="rollCountData">{rollRemain}</span>回
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default DiceArea;
