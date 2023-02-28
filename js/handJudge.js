export class handJudge {

    /**
     * 役を判定するクラスです
     * @param {Number[]} dices 
     */
    constructor(dices) {
        this.handSlot = dices;
        this.tempPoints = {
            "ace": 0,
            "deuce": 0,
            "tray": 0,
            "four": 0,
            "five": 0,
            "six": 0,
            "choice": 0,
            "fourDice": 0,
            "fullHouse": 0,
            "smallStraight": 0,
            "bigStraight": 0,
            "yacht": 0
        };
    };

    getAllHand() {
        this.tempPoints.ace = this.ace();
        this.tempPoints.deuce = this.deuce();
        this.tempPoints.tray = this.tray();
        this.tempPoints.four = this.four();
        this.tempPoints.five = this.five();
        this.tempPoints.six = this.six();
        this.tempPoints.choice = this.choice();
        this.tempPoints.fourDice = this.fourDice();
        this.tempPoints.fullHouse = this.fullHouse();
        this.tempPoints.smallStraight = this.smallStraight();
        this.tempPoints.bigStraight = this.bigStraight();
        this.tempPoints.yacht = this.yacht();
        return this.tempPoints;
    }

    ace() {
        return (this.handSlot.filter((value) => {
            return (value === 1);
        }).length);
    }

    deuce() {
        return (this.handSlot.filter((value) => {
            return (value === 2);
        }).length * 2);
    }

    tray() {
        return (this.handSlot.filter((value) => {
            return (value === 3);
        }).length * 3);
    }

    four() {
        return (this.handSlot.filter((value) => {
            return (value === 4);
        }).length * 4);
    }

    five() {
        return (this.handSlot.filter((value) => {
            return (value === 5);
        }).length * 5);
    }

    six() {
        return (this.handSlot.filter((value) => {
            return (value === 6);
        }).length * 6)
    }

    choice() {
        return (this.handSlot.reduce((a, b) => {
            return a + b;
        }));
    }

    fourDice() {
        let temp = 0;
        for (let i = 0; i < this.handSlot.length; i++) {
            if (this.handSlot.filter((value) => {
                return (value === this.handSlot[i]);
            }).length >= 4) {
                temp = this.handSlot[i] * 4;
                break;
            }
        }
        return temp;
    }

    fullHouse() {
        let temp = 0;
        for (let i = 0; i < this.handSlot.length; i++) {
            if (this.handSlot.filter((value) => {
                return (value === this.handSlot[i]);
            }).length === 3) {
                for (let j = 0; j < this.handSlot.length; j++) {
                    if (this.handSlot.filter((value) => {
                        return (value === this.handSlot[j]);
                    }).length === 2) {
                        temp = 25;
                        break;
                    }
                }
            }
        }
        return temp;
    }

    smallStraight() {
        let temp = 0;
        if (this.handSlot.includes(1) && this.handSlot.includes(2) && this.handSlot.includes(3) && this.handSlot.includes(4)) {
            temp = 30;
        } else if (this.handSlot.includes(2) && this.handSlot.includes(3) && this.handSlot.includes(4) && this.handSlot.includes(5)) {
            temp = 30;
        } else if (this.handSlot.includes(3) && this.handSlot.includes(4) && this.handSlot.includes(5) && this.handSlot.includes(6)) {
            temp = 30;
        }
        return temp;
    }

    bigStraight() {
        let temp = 0;
        if (this.handSlot.includes(1) && this.handSlot.includes(2) && this.handSlot.includes(3) && this.handSlot.includes(4) && this.handSlot.includes(5)) {
            temp = 40;
        } else if (this.handSlot.includes(2) && this.handSlot.includes(3) && this.handSlot.includes(4) && this.handSlot.includes(5) && this.handSlot.includes(6)) {
            temp = 40;
        }
        return temp;
    }

    yacht() {
        let temp = 0;
        for (let i = 0; i < this.handSlot.length; i++) {
            if (this.handSlot.filter((value) => {
                return (value === this.handSlot[i]);
            }).length === 5 && this.handSlot[i] !== 0) {
                temp = 50;
                break;
            }
        }
        return temp;
    }
}