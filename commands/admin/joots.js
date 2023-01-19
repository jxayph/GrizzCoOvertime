module.exports = {
	name: 'joots',
	description: 'meme',
	detailed: 'haha',
	admin: true,
	execute(message, args) { // Ignoring third `globals` argument
		if (args.length < 1) return;
		let jessage = '';
		for (let j = 0; j < args.length; j++) {
			if (args[j][0] == '\n') {
				jessage += '\nj' + args[j].slice(2) + ' ';
			}
			else {
				jessage += 'j' + args[j].slice(1) + ' ';
			}
		}
		message.channel.send(jessage);

		return;
	},
};
