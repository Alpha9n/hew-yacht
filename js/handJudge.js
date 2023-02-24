export class handJudge {
    constructor(dices) {
        this.hand = new Array();
    };

    ace() {
        return $(`.${DICE_FACE[0]}`).size();
    }
}