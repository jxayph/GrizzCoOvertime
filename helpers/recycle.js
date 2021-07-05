const shuffle = require('./shuffle.js').shuffle;
module.exports = {
	recycle(globals) { // shuffle players around and extend the seed
		globals.players = shuffle(globals.players);

		const file = `${globals.playerCount}.json`;
		const seed = require(`../seeds/${file}`);
		globals.seed = globals.seed.concat(seed);
	},
};