/**
 * @typedef {"hand"|"field"} Slot - サイコロのスロット位置
 */

import { handJudge as judge } from './handJudge';

/**
 * ゲームモードの定義
 */
const GAME_MODE = {
    0: 'LOCAL',
    1: 'ONLINE'
}


/**
 * サイコロの目の定義
 */
const DICE_FACE = {
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


let hand = []
let field = []


// 初期化処理
const init = (gameMode) => {

    if (gameMode === GAME_MODE.LOCAL) {
        console.log('ローカルモードの初期化処理');
        // サイコロの初期化処理
        diceInit();
        // 表の初期化処理
    }
};


/**
 * サイコロを初期化する関数
 */
const diceInit = () => {
    hand = []
    field = []
    $('.diceSlot').each((index, element) => {
        element = $(element);
        element.children().remove();
        element.append('<i class="fa-solid fa-square"></i>');
        hand.push("fa-solid fa-square");
        field.push("fa-solid fa-square");
    });
}


/**
 * サイコロを振る関数
 */
const diceRoll = () => {
    for (let i = 0; i < 5; i++) {
        const diceSlot = $('#randomDices').find('.diceSlot').eq(i);
        const diceFace = Math.floor(Math.random() * 6) + 1;
        diceSlot.children().remove();
        diceSlot.append(`<i class="fa-solid ${DICE_FACE[diceFace]}"></i>`);
    }
}


// ダイスロールボタンのイベント登録
$('#diceRoll').find('.button').on('click', diceRoll);
$(document).keydown((event) => {
    if (event.which === 32) {
        diceRoll();
    }
});


let usedSlot = 0;
/**
 * サイコロの保持をする関数
 * @param {*} event - クリックターゲット
 * @returns 
 */
const registerDice = (event) => {
    console.log('rollDiceClick!!')
    const diceSlot = $(event.currentTarget);
    const diceSlotAttr = diceSlot.children().attr('class');
    if (usedSlot >= 5 || diceSlotAttr === 'fa-solid fa-square') {
        return;
    };
    console.log(diceSlotAttr)
    $('#determinedDice').find('.diceSlot').children().eq(usedSlot).attr('class', diceSlotAttr);
    usedSlot++;
    diceSlot.remove();
}


/**
 * 保持したサイコロの解除をする関数
 * @param {*} event - クリックターゲット
 * @returns 
 */
const unRegisterDice = (event) => {
    const diceSlot = $(event.currentTarget);
    const diceSlotAttr = diceSlot.children().attr('class');
    if (diceSlotAttr === 'fa-solid fa-square') {
        return;
    };
    console.log(diceSlotAttr);
    $('#randomDices').append(`<li class="diceSlot"><i class="${diceSlotAttr}"></i></li>`);
    usedSlot--;
    diceSlot.children().attr('class', 'fa-solid fa-square');
    $('#randomDices').find('.diceSlot').on('click', registerDice);
}

$('#randomDices').find('.diceSlot').on('click', registerDice);
$('#determinedDice').find('.diceSlot').on('click', unRegisterDice);


/**
 * サイコロの位置を移動させる関数
 * @param {Number} diceNum - サイコロの目
 * @param {Slot} to - 移動先
 * @param {Slot} from - 移動元
 * @param {Number} position - 配列の添字
 */
const moveDice = (diceNum, from, to, position) => {
    addDice(diceNum, to);
    removeDice(diceNum, from, position);
};

/**
 * 指定したスロットにサイコロを追加する関数
 * @param {Number} diceNum - サイコロの目
 * @param {Slot} to - 追加先のスロット
 */
const addDice = (diceNum, to) => {
    
};

/**
 * 指定したスロットのサイコロを削除する関数
 * @param {Number} diceNum - サイコロの目
 * @param {Slot} from - 削除元のスロット
 * @param {Number} position - 配列の添字
 */
const removeDice = (diceNum, from, position) => {
    obj[from][position]
};



// 役の判定処理
// 表への登録処理
// ターンの切り替え
// ターン切り替え時のメッセージ
// 表のハイライト表示の切り替え
let turnCount = 0;
$('.scoreSlot').on('click', (event) => {
    let target = $(event.currentTarget);
    if (target.hasClass('active') && target.text() === '') {
        $('.player1').toggleClass('active');
        $('.player2').toggleClass('active');
        target.text('100')
        turnCount += 1;
        console.log(turnCount)
        diceInit();
        if (turnCount === 2) {
            turnCount = 0;
            const turnNum = $('#turnNum').text();
            if (Number(turnNum) >= 12) {
                $('#resultScreen').css('display', 'block');
                return
            } 
            $('#turnNum').text(Number(turnNum) + 1);
        }
    }
});


// プレイヤー1に最初のターンを与える
$('.player1').addClass('active');


// ゲームの終了判定


// ゲームの終了処理
    // ゲームの終了画面の表示

$('#resultScreen').find('.button').on('click', () => {
});


// 関数の実行
onload = () => {
    const url = new URL(location.href);
    const gameMode = url.searchParams.get('mode');
    if (gameMode === 'online') {
        init(GAME_MODE.ONLINE);
    } else {
        init(GAME_MODE.LOCAL);
    }
}