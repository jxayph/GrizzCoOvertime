module.exports = {
	name: 'score',
	description: 'Check your tournament score.',
	detailed: 'Syntax: !score, !score all\n' +
		'May not be called unless there is a tournament actively running. Add "all" to see your scores for the rounds so far.',
	admin: false,
	execute(message, args, globals) {
		if (!globals.tourneyPhase) {
			return message.channel.send('There is currently no active tournament.');
		}
		else {
			let scoreString = '';

			const author = globals.players.filter(player => player.userID === message.author.id)[0];
			if (author === undefined) {
				return message.reply(' I can\'t get your score, you are not participaing in the tournament!');
			}
			if (args[0] == 'all') {
				const player = globals.players.find(thisPlayer => thisPlayer.userID == message.author.id);

				for (let i = 0; (i < player.scores.length) && (i < globals.currentRound + 1); i++) {
					scoreString = scoreString + `Round ${i + 1}: ${player.scores[i]}\n`;
				}
			}
			let textMessage = `Player ${author.getMention()}, you have an adjusted score of ${author.getScore()}. Keep up the good work!`;
			if (scoreString != '') textMessage = textMessage + ('\n' + scoreString);
			return message.channel.send(textMessage);
		}

	},
};

// module.exports = {
// 	name: 'score',
// 	description: 'Check your tournament score.',
// 	detailed: 'May not be called unless there is a tournament actively running.',
// 	admin: false,
// 	execute(message, args, globals) {
// 		if (!globals.tourneyPhase) {
// 			return message.channel.send('There is currently no active tournament.');
// 		}
// 		else {
// 			const author = globals.players.filter(player => player.userID === message.author.id)[0];
// 			if(author === undefined) {
// 				return message.reply(' I can\'t get your score, you are not participaing in the tournament!');
// 			}

// 			return message.channel.send(`Player ${author.getMention()}, you have a score of ${author.getScore()}. Keep up the good work!`);
// 		}
// 	},
// };

