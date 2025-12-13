/**
 * Game logic utilities - Multiplayer ready
 */

export const DICE_FACE = {
  0: 'fa-square',
  1: 'fa-dice-one',
  2: 'fa-dice-two',
  3: 'fa-dice-three',
  4: 'fa-dice-four',
  5: 'fa-dice-five',
  6: 'fa-dice-six',
};

export const BONUS_BORDER = 63;
export const BONUS_POINT = 35;

/**
 * サイコロを振る
 * @param {number[]} field - 現在のfield配列
 * @param {number} rollRemain - 残りロール回数
 * @returns {number[]} - 新しいfield配列
 */
export const rollDice = (field, rollRemain) => {
  if (rollRemain <= 0) {
    return field;
  }

  const newField = [...field];
  for (let i = 0; i < 5; i++) {
    const diceFace = Math.floor(Math.random() * 6) + 1;
    if (rollRemain === 3 || newField[i] !== 0) {
      newField[i] = diceFace;
    }
  }
  return newField;
};

/**
 * サイコロを手持ちに移動
 * @param {number[]} hand - 手持ち配列
 * @param {number[]} field - field配列
 * @param {number} index - 移動するインデックス
 * @returns {{hand: number[], field: number[]}}
 */
export const moveDiceToHand = (hand, field, index) => {
  const newHand = [...hand];
  const newField = [...field];
  const diceValue = newField[index];

  if (diceValue === 0) return { hand, field };

  // fieldから削除
  newField[index] = 0;

  // handに追加
  const emptyIndex = newHand.findIndex((v) => v === 0);
  if (emptyIndex !== -1) {
    newHand[emptyIndex] = diceValue;
  }

  return { hand: newHand, field: newField };
};

/**
 * サイコロをfieldに戻す
 * @param {number[]} hand - 手持ち配列
 * @param {number[]} field - field配列
 * @param {number} index - 移動するインデックス
 * @returns {{hand: number[], field: number[]}}
 */
export const moveDiceToField = (hand, field, index) => {
  const newHand = [...hand];
  const newField = [...field];
  const diceValue = newHand[index];

  if (diceValue === 0) return { hand, field };

  // handから削除
  newHand[index] = 0;

  // fieldに追加
  const emptyIndex = newField.findIndex((v) => v === 0);
  if (emptyIndex !== -1) {
    newField[emptyIndex] = diceValue;
  }

  return { hand: newHand, field: newField };
};

/**
 * すべてのサイコロを手持ちに移動
 * @param {number[]} hand - 手持ち配列
 * @param {number[]} field - field配列
 * @returns {{hand: number[], field: number[]}}
 */
export const moveAllDiceToHand = (hand, field) => {
  let newHand = [...hand];
  let newField = [...field];

  field.forEach((value, index) => {
    if (value !== 0) {
      const result = moveDiceToHand(newHand, newField, index);
      newHand = result.hand;
      newField = result.field;
    }
  });

  return { hand: newHand, field: newField };
};

/**
 * プレイヤーのスコアを計算
 * @param {Object} scores - プレイヤーのスコアオブジェクト
 * @returns {{total: number, bonus: number, hasBonus: boolean}}
 */
export const calculatePlayerScore = (scores) => {
  let total = 0;
  let simpleHandTotal = 0;

  const simpleHands = ['ace', 'deuce', 'tray', 'four', 'five', 'six'];

  Object.entries(scores).forEach(([hand, score]) => {
    if (score !== null) {
      total += score;
      if (simpleHands.includes(hand)) {
        simpleHandTotal += score;
      }
    }
  });

  const hasBonus = simpleHandTotal >= BONUS_BORDER;
  const bonus = hasBonus ? BONUS_POINT : 0;

  return {
    total: total + bonus,
    bonus,
    hasBonus,
    simpleHandTotal,
  };
};

/**
 * ゲーム終了判定
 * @param {Object} player1Scores - プレイヤー1のスコア
 * @param {Object} player2Scores - プレイヤー2のスコア
 * @returns {boolean}
 */
export const isGameOver = (player1Scores, player2Scores) => {
  const allHands = [
    'ace',
    'deuce',
    'tray',
    'four',
    'five',
    'six',
    'choice',
    'fourDice',
    'fullHouse',
    'smallStraight',
    'bigStraight',
    'yacht',
  ];

  return allHands.every(
    (hand) => player1Scores[hand] !== null && player2Scores[hand] !== null
  );
};

/**
 * 初期スコアオブジェクトを作成
 * @returns {Object}
 */
export const createInitialScores = () => ({
  ace: null,
  deuce: null,
  tray: null,
  four: null,
  five: null,
  six: null,
  choice: null,
  fourDice: null,
  fullHouse: null,
  smallStraight: null,
  bigStraight: null,
  yacht: null,
});
