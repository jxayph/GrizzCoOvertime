module.exports = {
	name: 'viewscore',
	description: 'View a player\'s score.',
	detailed: 'Syntax: !viewscore <playerMention>',
	admin: true,
	async execute(message, args, globals) {
		if (!globals.tourneyPhase) {
			return message.channel.send('There is currently no active tournament.');
		}
		else {
			if (!message.mentions.users.first()) {
				return await message.channel.send('Please mention a player.');
			}
			const userID = message.mentions.users.first().id;

			const player = globals.players.find(thisPlayer => thisPlayer.userID == userID);
			if (!player) {
				return await message.channel.send('Please mention a participating player.');
			}
			let scoreString = '';

			for (let i = 0; (i < player.scores.length) && (i < globals.currentRound + 1); i++) {
				scoreString = scoreString + `Round ${i + 1}: ${player.scores[i]}\n`;
			}

			let textMessage = `Player ${player.getMention()}, you have an adjusted score of ${player.getScore()}. Keep up the good work!`;
			if (scoreString != '') textMessage = textMessage + ('\n' + scoreString);
			return message.channel.send(textMessage);
		}

	},
	// execute(message, args, globals) {
	// 	if (!message.mentions.users.first()) {
	// 		return await message.channel.send('Please mention a player.');
	// 	}
	// 	const userID = message.mentions.users.first().id;

	// 	const player = globals.players.find(thisPlayer => thisPlayer.userID == userID);
	// 	if (!player) {
	// 		return await message.channel.send('Please mention a participating player.');
	// 	}
	// 	await message.channel.send(`Scores: ${player.scores}`);
	// },
};