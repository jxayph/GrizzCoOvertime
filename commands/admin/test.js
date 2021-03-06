const Player = require('../../helpers/Player.js');
const loadSeed = require('../../helpers/loadSeed.js').loadSeed;
const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		if (!message.mentions.users.first()) {
			return await message.channel.send('Please mention a player.');
		}
		const userID = message.mentions.users.first().id;

		const player = globals.players.find(player => player.userID == userID);
		if (!player) {
			return await message.channel.send('Please mention a participating player.');
		}
		await message.channel.send(`${player.scores}`);
		console.log(player.scores);
	},
};