module.exports = {
	name: 'add',
	description: 'Add some numbers.',
	detailed: '2 + 2 is 4 quick maths.',
	admin: false,
	execute(message, args, globals) {
		let sum = 0;
		let i = 0;
		while (args[i]) {
			if (!isNaN(parseInt(args[i]))) {
				sum += parseInt(args[i]);
			}
			i++;
		}
		return message.channel.send(`Your sum is ${sum}!`);
	},
};