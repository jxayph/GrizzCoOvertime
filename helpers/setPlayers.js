/*
Create set of participating player objects using player data
*/
const Player = require('./Player.js');

module.exports = {
	setPlayers(data, globals) {
		if (!globals.players) {
			globals.players = [];

			for (let i = 0; i < data.length; i++) {

				const FC = `SW-${data[i][1].FC.slice(0, 4)}-${data[i][1].FC.slice(4, 8)}-${data[i][1].FC.slice(8, 12)}`;

				globals.players.push(new Player(data[i][1].IGN, FC, data[i][0]));
			}
		}
		else { // Setting players mid-tourney for reseeding
			const playersCopy = globals.players.slice();
			globals.players = [];
			for (let i = 0; i < data.length; i++) {
				/*  copy reference to players
					for each player in data, search for player in playerCopy
					push player to globals.players
				 */
				const player = playersCopy.find(thisPlayer => thisPlayer.userID == data[i][0]);
				globals.players.push(player);
			}
		}
	},
};