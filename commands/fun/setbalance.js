module.exports = {
	name: 'setbalance',
	description: 'Set a user\'s balance.',
	detailed: '!setbalance <value> <mention>',
	admin: true,
	async execute(message, args, globals) {
		const value = parseInt(args[0]);
		const userID = message.mentions.users.first().id;

		if (isNaN(value) || !isFinite(value)) return message.channel.send('Invalid value.');

		if (!userID) return message.channel.send('Please mention a player.');

		const user = globals.client.userData[userID];
		if (!user) return message.channel.send('Please mention a valid player.');

		user.balance = args[0];
		return message.channel.send(`Set ${user.IGN}'s balance to ${value}`);
	},
};
