module.exports = {
	loadSeed(numPlayers, globals) {
		const file = `${numPlayers}.json`;
		globals.seed = require(`../seeds/${file}`);
	},
};
