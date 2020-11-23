const DC_VALUE = 10;
const RANDOM_VALUE = 3;

module.exports = class Player {
    constructor(IGN, FC, userID) {
        this.IGN = IGN;
        this.FC = FC;
        this.userID = userID;
        this.scores = [];
        this.teamDC = [];
        this.randoms = [];
    }

    getMention() {
        return `<@${this.userID}>`;
    }

    getScore() {
        const scoreClone = this.scores.slice().sort((a, b) => b - a); // Sorts the scores in descending order.
        let sum = 0;

        for (let i = 0; i < scoreClone.length; i++) {
            sum += parseInt(scoreClone[i]);
        }

        let teamDCRounds = this.teamDC.filter(hadDisconnect => hadDisconnect);
        let randomRounds = this.randoms.filter(hadRandom => hadRandom);

        sum += parseInt(teamDCRounds.length * DC_VALUE);
        sum += parseInt(randomRounds.length * RANDOM_VALUE);

        return sum;
    }

}
