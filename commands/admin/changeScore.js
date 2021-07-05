module.exports = {
	name: 'changescore',
	description: 'Change a user\'s score for a specific round.',
	detailed: 'Syntax: !changescore <score> <round> <playerMention>',
	admin: true,
	async execute(message, args, globals) {
		const score = parseInt(args[0]);
		if (!args[0]) {
			return await message.channel.send('Please input a score.');
		}

		const round = (args[1] - 1);
		if (!args[1] || args[1] > globals.currentRound) {
			return await message.channel.send('Please input a valid round.');
		}


		if (!message.mentions.users.first()) {
			return await message.channel.send('Please mention a player.');
		}
		const userID = message.mentions.users.first().id;

		const player = globals.players.find(thisPlayer => thisPlayer.userID == userID);
		if (!player) {
			return await message.channel.send('Please mention a participating player.');
		}

		player.scores[round] = score;
		await message.channel.send(`Setting a score of ${score} for ${player.IGN} round ${round + 1}.`);
		console.log(player.scores);

	},
};
