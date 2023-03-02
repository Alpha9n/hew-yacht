/**
 * 画面上にメッセージを表示する
 * @param {String} message 
 * @param {'info'|'warn'|'error'} type 
 */
export const sendMessage = (message, messageType) => {
    let createdMessage = `${createMessage(messageType)}${message}`
    console.log(createdMessage);
}

const createMessage = (messageType) => {
    switch(messageType){
        case 'info':
            return '[情報]: ';
        case 'warn':
            return '[警告]: ';
        case 'error':
            return '[エラー]: ';
        default:
            return '[情報]: ';
    }
}