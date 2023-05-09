module.exports = {
	name: 'viewbalance',
	description: 'View a user\'s balance.',
	detailed: '!viewbalance <mention>',
	admin: true,
	async execute(message, args, globals) {
		const userID = message.mentions.users.first().id;

		if (!userID) return message.channel.send('Please mention a player.');

		const user = globals.client.userData[userID];
		if (!user) return message.channel.send('Please mention a valid player.');

		return message.channel.send(`${user.IGN} has ${user.balance} golden egg coins.`);
	},
};
