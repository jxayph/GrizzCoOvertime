module.exports = {
	name: 'score',
	description: 'Check your tournament score.',
	detailed: 'May not be called unless there is a tournament actively running.',
	admin: false,
	execute(message, args, globals) {
		if (!globals.tourneyPhase) {
			return message.channel.send('There is currently no active tournament.');
		}
		else {
			const author = globals.players.filter(player => player.userID === message.author.id)[0];
			if(author === undefined) {
				return message.reply(' I can\'t get your score, you are not participaing in the tournament!');
			}

			return message.channel.send(`Player ${author.getMention()}, you have a score of ${author.getScore()}. Keep up the good work!`);
		}
	},
};

