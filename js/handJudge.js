class handJudge {
    constructor(dices) {
        this.hand = new Array();
    };

    static ace() {
        return $(`.${DICE_FACE[0]}`).size();
    }
}