/**
 * @typedef {"hand"|"field"} Slot - サイコロのスロット位置
 * @typedef {"local"|"online"} GameMode - ゲームモード
 */

import { handJudge } from './handJudge.js';
import { sendMessage } from './message.js';

// 配列の中身を出力
// document.addEventListener('click', () => {console.log("-------------------------");console.log(`hand - ${hand}`);console.log(`field - ${field}`);});

/**
 * サイコロの目の定義
 */
const DICE_FACE = {
    0: 'fa-square',
    1: 'fa-dice-one',
    2: 'fa-dice-two',
    3: 'fa-dice-three',
    4: 'fa-dice-four',
    5: 'fa-dice-five',
    6: 'fa-dice-six'
}

/**
 * サイコロのスロット位置の定義
 */
const FIELD_TYPE = {
    'hand': '#determinedDice',
    'field': '#randomDices'
}

/** @type {Number[]} - DICE_FACE内の数値を格納 */
let hand = [];
/** @type {Number[]} - DICE_FACE内の数値を格納 */
let field = [];
/** @type {Boolean} - ダイスロールが初回かどうか */
let isFirstRoll = true;

let rollRemain = 3;

const temp = 'tempSlot';

// let handPoints = [
//     {name: 'ace', p1: 0, p2: 0},
//     {name: 'deuce', p1: 0, p2: 0},
//     {name: 'tray', p1: 0, p2: 0},
//     {name: 'four', p1: 0, p2: 0},
//     {name: 'five', p1: 0, p2: 0},
//     {name: 'six', p1: 0, p2: 0},
//     {name: 'choice', p1: 0, p2: 0},
//     {name: 'fourDice', p1: 0, p2: 0},
//     {name: 'fullHouse', p1: 0, p2: 0},
//     {name: 'smallStright', p1: 0, p2: 0},
//     {name: 'bigStraight', p1: 0, p2: 0},
//     {name: 'yacht', p1: 0, p2: 0}
// ]

/**
 * fieldTypeで指定したdiceListを取得する。
 * @param {Slot} fieldType 
 * @return {Number[]}
 */
const getDiceList = (fieldType) => {
    if(fieldType === 'hand') {
        return hand;
    }else if (fieldType === 'field') {
        return field;
    }
    return null;
}

/**
 * 初期化関数
 * @param {GameMode} gameMode 
 */
const init = (gameMode) => {

    if (gameMode == "local") {
        console.log('ローカルモードの初期化処理');
        localInit();
        return true;
    } else if (gameMode == "online") {
        return true;
    } else {
        localInit();
        return true;
    }
};

const localInit = () => {
    // サイコロの初期化処理
    hand = [0, 0, 0, 0, 0];
    field = [0, 0, 0, 0, 0];
    diceApply();
    // 表の初期化処理
    applyTotalScoreToTable();
    applyRollCount();
    // プレイヤー1に最初のターンを与える
    $('.player1').addClass('active');
    $('#playerTurn').text('1');
}

/**
 * サイコロ配列の内容をHTML要素に反映させる関数
 */
const diceApply = () => {
    hand.forEach((elem, index) => {
        let element = $('#determinedDice').find('.diceSlot').eq(index);
        let diceElem = DICE_FACE[elem];
        element.children().remove();
        element.append(`<i class="fa-solid ${diceElem}"></i>`);
    });
    field.forEach((elem, index) => {
        let element = $('#randomDices').find('.diceSlot').eq(index);
        let diceElem = DICE_FACE[elem];
        element.children().remove();
        element.append(`<i class="fa-solid ${diceElem}"></i>`);
    });
    
    $('#randomDices').find('.diceSlot').on('click', registerDice);
    $('#determinedDice').find('.diceSlot').on('click', unRegisterDice);
}

/**
 * サイコロの残り回数を適用する関数
 */
const applyRollCount = () => {
    $('.rollCountData').text(rollRemain);
}

/**
 * ターンをスキップする関数
 */
const turnSkip = () => {
    hand = [0, 0, 0, 0, 0];
    field = [0, 0, 0, 0, 0];
    isFirstRoll = true;
    diceApply();
}

/**
 * サイコロを振る関数
 */
const diceRoll = () => {
    if (rollRemain <= 0) {
        return;
    }
    for (let i = 0; i < 5; i++) {
        const diceFace = Math.floor(Math.random() * 6) + 1;
        if (!(rollRemain == 3) && field[i] === 0) {
            continue;
        }
        removeDice(field, i);
        addDice(diceFace, field);
    }
    diceApply();
    applyTempPointToTable();
    rollRemain--;
    if (rollRemain == 0) moveDiceAll();
    applyRollCount();
}

/**
 * 実行時点での各役の点数を取得する関数
 */
const getTempPoints = () => {
    let tempList = hand.concat(field).filter((elem) => {
        return elem !== 0;
    });
    let tempPoints = new handJudge(tempList).getAllHand();
    return tempPoints;
}

/**
 * 実行時点での各役の点数を表に反映させる関数
 */
const applyTempPointToTable = () => {
    let tempPoints = getTempPoints();
    for (let key in tempPoints) {
        let slot = $(`#${key}`).find('.active');
        if (slot.text() === '' || slot.hasClass(temp)) {
            slot.addClass(temp);
            slot.text(Number(tempPoints[key]));
        }
    }
    document
        .getElementById('simpleHand');
}

/**
 * 表に実行時点での点数を反映させる関数
 */
const applyTotalScoreToTable = () => {
    let p1TotalScore = 0;
    let p2TotalScore = 0;
    console.log("-------------------------");
    $('.scoreSlot').each((elem, index) => {
        if (!($(elem).hasClass(temp))) {
            if ($(elem).hasClass('player1')) {
                p1TotalScore += Number($(elem).text());
            } else {
                p2TotalScore += Number($(elem).text());
            }
        }
        console.log(`hoge: ${$(elem).text()}`)
    });
    $('.player1.totalScore').text(p1TotalScore);
    $('.player2.totalScore').text(p2TotalScore);
}

// ダイスロールボタンのイベント登録
$('#diceRoll').find('.rollButton').on('click', diceRoll);
$(document).keydown((event) => {
    if (event.which === 32) {
        diceRoll();
    }
});

let usedSlot = 0;
/**
 * サイコロの保持をする関数
 */
const registerDice = (event) => {
    let index = $(event.currentTarget).index();
    moveDice("field", "hand", index);
}

/**
 * 保持したサイコロの解除をする関数
 * @param {*} event - クリックターゲット
 * @returns 
 */
const unRegisterDice = (event) => {
    let index = $(event.currentTarget).index();
    moveDice("hand", "field", index);
}

/**
 * サイコロの位置を移動させる関数
 * @param {Number} diceNum - サイコロの目
 * @param {Slot} to - 移動先
 * @param {Slot} from - 移動元
 * @param {Number} position - 移動元配列の添字
 */
const moveDice = (from, to, position) => {
    let fromArray = getDiceList(from);
    let toArray = getDiceList(to);
    let diceNum = fromArray[position];
    if (diceNum === void 0) {
        console.log('its undefined');
        return;
    }
    removeDice(fromArray, position);
    addDice(diceNum, toArray);
    diceApply();
};

/**
 * 指定したスロットにサイコロを追加する関数
 * @param {Number} value - サイコロの目
 * @param {Number[]} arr - 追加先のスロット
 */
const addDice = (value, arr) => {
    const index = getFirstZero(arr); // 最初の0の添字を取得
    if (index !== -1) { // 0が見つかった場合
      arr[index] = value; // 0を指定された値に置き換える
    }
    return arr;
}

/**
 * 指定したスロットのサイコロを削除する関数
 * @param {Number[]} arr - 削除元のスロット
 * @param {Number} position - 配列の添字
 */
const removeDice = (arr, index) => {
    if (index >= 0 && index < arr.length) {
      arr[index] = 0;
    }
    return arr;
}

/**
 * ゼロで初期化されている配列の最初の未使用の値の添字を返します
 * @param {Array} arr - 配列
 * @returns {Number} - 添字
 */
const getFirstZero = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 0) {
        return i;
      }
    }
    return -1; // 配列に0が含まれていない場合は-1を返す
}

// ターン切り替え時のメッセージ

let turnCount = 0;
let turnNum = 1;

const turnNumApply = () => {
    $('#turnNum').text(turnNum);
}

/**
 * プレイヤーのターンを切り替える。
 * @param {String} playerName
 */
const playerTurn = (playerName) => {
    $('#playerTurn').text(playerName);
    sendMessage(`player ${playerName} のターンです。`, 'info');
}

/**
 * fieldのすべてのサイコロを手持ちに移動する関数
 */
const moveDiceAll = () => {
    field.forEach((value, index) => {
        if(value === 0) return;
        moveDice('field', 'hand', index);
    });
}

$('.scoreSlot').on('click', (event) => {
    let target = $(event.currentTarget);
    // ロールされていない状態でのクリックのキャンセル
    if (rollRemain >= 3) return;
    // ターンの切り替え
    if (target.hasClass('active')) {
        if (target.text() === '' || target.hasClass(temp)) {
            moveDiceAll();
            target.removeClass(temp);
            $(`.${temp}`).each((index, elem) => {
                $(elem).text('');
                $(elem).removeClass(temp);
            });
            $('.player1').toggleClass('active');
            $('.player2').toggleClass('active');
            rollRemain = 3;
            applyRollCount();
            applyTotalScoreToTable();
            if (turnCount == 1) playerTurn('1'); 
            else playerTurn('2');
            turnCount += 1;
            console.log(turnCount);
            turnSkip();
            if (turnCount === 2) {
                turnCount = 0;
                if (Number(turnNum) >= 12) {
                    $('#resultScreen').css('display', 'block');
                    return
                } 
                turnNum++;
                turnNumApply();
                return;
            }
        }
    }
});



// ゲームの終了判定


// ゲームの終了処理
    // ゲームの終了画面の表示

$('#resultScreen').find('.button').on('click', () => {
});


// 関数の実行
onload = () => {
    const url = new URL(location.href);
    const urlQuery = url.searchParams.get('mode');
    init(urlQuery)
}