const DC_VALUE = 0;
const FREELANCER_VALUE = 0;

module.exports = class Player {
	constructor(IGN, FC, userID) {
		this.IGN = IGN;
		this.FC = FC;
		this.userID = userID;
		this.scores = [];
		this.teamDC = [];
		this.randoms = [];
		this.encounters = {};
	}

	getMention() {
		return `<@${this.userID}>`;
	}

	getScore() {
		const scoreClone = this.scores.slice().sort((a, b) => b - a); // Sorts the scores in descending order.
		let sum = 0;
		let lowestScore = 9999;

		for (let i = 0; i < scoreClone.length; i++) {
			if (scoreClone[i]) {
				if (lowestScore > scoreClone[i]) lowestScore = scoreClone[i];
				sum += parseInt(scoreClone[i]);
			}
		}

		const teamDCRounds = this.teamDC.filter(hadDisconnect => hadDisconnect);
		const randomRounds = this.randoms.filter(hadRandom => hadRandom);

		sum += parseInt(teamDCRounds.length * DC_VALUE);
		sum += parseInt(randomRounds.length * FREELANCER_VALUE);

		sum -= lowestScore;

		return sum;
	}

};
