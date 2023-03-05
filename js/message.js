/**
 * 画面上にメッセージを表示する
 * @param {String} message 
 * @param {'info'|'warn'|'error'} type 
 */
export const sendMessage = (message, messageType) => {
    let createdMessage = `${createMessage(messageType)}${message}`
    console.log(createdMessage);
}

export const messageType = {
    'info': 0,
    'warn': 1, 
    'error': 2
}

const createMessage = (messageType) => {
    switch(messageType){
        case 'info' || 0:
            return '[情報]: ';
        case 'warn' || 1:
            return '[警告]: ';
        case 'error' || 3:
            return '[エラー]: ';
        default:
            return '[情報]: ';
    }
}