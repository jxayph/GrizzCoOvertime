const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
const checkValue = require('../../helpers/checkValue.js').checkValue;

module.exports = {
	name: 'throw',
	description: 'Throw some golden eggs at a coworker',
	detailed: '!throw <number of eggs> <mention the recipient>',
	admin: false,
	async execute(message, args, globals) {

		if (!message.mentions.users.first()) {
			return await message.channel.send('Please mention a user.');
		}

		const value = parseInt(args[0]);
		const thrower = globals.client.userData[message.author.id];
		const reciever = globals.client.userData[message.mentions.users.first().id];

		if (!thrower || !reciever) { // If either the thrower or reciever do not have userData
			return await message.channel.send('Please mention a valid user.');
		}

		if (!checkValue(value, thrower)) {
			return await message.channel.send('Please enter a valid number of golden eggs.');
		}

		reciever.balance += value;
		thrower.balance -= value;

		saveUserData(globals.fs, globals.client);

		return message.reply(`You threw ${value} golden eggs to your coworker!`);

	},
};
