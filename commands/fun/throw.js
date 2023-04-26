const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'throw',
	description: 'Throw some golden eggs at a coworker',
	detailed: '!throw <number of eggs> <mention the recipient>',
	admin: false,
	async execute(message, args, globals) {

		if (!message.mentions.users.first()) {
			return await message.channel.send('Please mention a user.');
		}
		const count = parseInt(args[0]);
		const thrower = globals.client.userData[message.author.id];
		const reciever = globals.client.userData[message.mentions.users.first().id];
		if (!thrower || !reciever) {
			return await message.channel.send('Please mention a valid user.');
		}

		if (isNaN(args[0]) || count < 1 || count > thrower.balance) {
			return await message.channel.send('Please enter a valid number of golden eggs.');
		}
		reciever.balance += count;
		thrower.balance -= count;

		saveUserData(globals.fs, globals.client);

		return message.reply(`You threw ${count} golden eggs to your coworker!`);

	},
};
