module.exports = {
	name: 'viewscore',
	description: 'View a player\'s score.',
	detailed: 'Syntax: !viewscore <playerMention>',
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
		await message.channel.send(`Scores: ${player.scores}`);
	},
};