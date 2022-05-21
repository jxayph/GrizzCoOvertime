module.exports = {
	name: 'joots',
	description: 'meme',
	detailed: 'haha',
	admin: true,
	errorMessage: '',
	execute(message, args, globals) {
		let jessage = '';
		for (let i = 0; i < args.length; i++) {
			console.log(args[i]);
			console.log(args[i][0]);
			if (args[i][0] == '\n') {
				jessage += '\nj' + args[i].slice(2) + ' ';
			}
			else{
				jessage += 'j' + args[i].slice(1) + ' ';
			}
		}
		message.channel.send(jessage);

		return;
	},
};
