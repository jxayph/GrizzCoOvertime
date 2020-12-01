/*
Create set of participating player objects using player data
*/
const Player = require('./Player.js');

module.exports = {
	setPlayers(data, globals) {
		globals.players = [];

		for (let i = 0; i < data.length; i++) {

			const FC = `SW-${data[i][1].FC.slice(0, 4)}-${data[i][1].FC.slice(4, 8)}-${data[i][1].FC.slice(8, 12)}`;

			globals.players.push(new Player(data[i][1].IGN, FC, data[i][0]));
		}

	},
};