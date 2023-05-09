const BOT_ID = '518861328526606347';

module.exports = class Lotto {
	constructor(players, ID, resolved, pot) {
		this.players = players;
		this.pot = pot;
	}

	getPot() {
		return (`The pot is currently sitting at ${this.pot} golden egg coins.`);
	}

	getWager(ID) {
		const player = this.players.find(p => p.ID == ID);
		if (player) return player.wager;
		else return -1;
	}

	resolve(userData, message) {
		if (this.pot == 0) {
			return message.reply('The pot\'s empty!');
		}
		const randInt = Math.floor(Math.random() * this.pot * 1.5);
		if (randInt > this.pot) { // Eggbot wins
			userData[BOT_ID].balance += this.pot;
			message.channel.send(`${userData[BOT_ID].IGN} won the pot of ${this.pot} golden egg coins!`);
		}
		else {
			let sum = 0;
			let i = 0;
			for (i = 0; i < this.players.length; i++) {
				sum += this.players[i].wager;
				if (sum >= randInt) break;
			}
			const winner = userData[this.players[i].ID];
			winner.balance += this.pot;
			message.channel.send(`${winner.IGN} won the pot of ${this.pot} golden egg coins!`);
		}
		this.players = [];
		this.pot = 0;
	}

	buy(playerID, playerwager) {
		const playerIndex = this.players.findIndex(player => player.ID == playerID);

		if (playerIndex == -1) {
			this.players.push({ ID: playerID, wager: playerwager });
		}
		else {
			this.players[playerIndex].wager += playerwager;
		}
		this.pot += playerwager;


		return;
	}

};

/*
open new lotto
lotto has list of players who've entered, indexed by userID.
*/