module.exports = {
	name: 'balance',
	description: 'Check your balance',
	detailed: 'Check your gegg balance.',
	admin: false,
	async execute(message, args, globals) {

		const userData = globals.client.userData[message.author.id];
		if (userData) {
			message.reply(`You have ${userData.balance} <:GoldenEgg:783112272981655574>.`);
		}
		else {
			message.reply('You are not registered.');
		}
	},
};
