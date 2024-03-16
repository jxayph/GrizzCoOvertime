/*
- !redo add <squad>:
  - Generate an object and store it in the globals.redos array, indexed by order of redos popping up.
  - Output a message acknowledging the redo
  - Produce a list of redos, and their status
- !redo submit <n>
  - Change the score for the 4 members in the redo, and mark the redo as complete
- !redo ping
  - Ping relevant players to notify them of the redo
*/

module.exports = class Redo {
	constructor(round, players, index) {
		this.round = round; // Integer; round of the redo
		this.players = players; // Array of Player objects; relevant players to the redo
		this.complete = false; // bool, redo completion status
		this.index = index; // Integer, Index in the redo array
	}

	mentionPlayers() {
		let message = 'Players';
		for (let i = 0; i < this.players.length; i++) {
			message = message + ` ${this.players[i].getMention()}`;
		}
		return (message + ', please report for your redo.');
	}

	submitRedo(score) {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].scores[this.round] = score;
		}
		this.complete = true;
		return (`Successfully submitted a new score of ${score} for redo number ${this.index + 1}.`);
	}

	printRedo() {
		let complete = '';
		const playerStrings = [];
		for (let i = 0; i < 4; i++) {
			if (this.players[i] != undefined) {
				playerStrings.push(this.players[i].IGN);
			}
			else {
				playerStrings.push('Freelancer');
			}
		}

		if (this.complete) complete = '✅';
		else complete = '❌';

		return (
			`Redo index ${this.index + 1} is ${complete}.` + '\n' +
			`Players are ${playerStrings[0]}, ${playerStrings[1]}, ${playerStrings[2]} and ${playerStrings[3]}, from Round ${this.round + 1}.\n`
		);
	}


};
