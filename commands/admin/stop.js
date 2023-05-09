const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'stop',
	description: 'Log Egg Bot out of discord.',
	detailed: '!stop <confirm> <emergency>',
	admin: true,
	async execute(message, args, globals) {
		console.log(args);
		if (!args[0]) { // !stop
			return message.reply('Are you sure you want me to log myself out? Please invoke `!stop confirm` to make me save and quit. Invoke `!stop confirm emergency` to make me log out without saving. ');
		}
		if (args[0] == 'confirm' && !args[1]) { // !stop confirm
			saveUserData(globals.fs, globals.client);
			await message.reply('Now saving and logging out. Goodbye!');
			globals.client.destroy();

		}

		if (args[0] && args[1] != 'emergency') return message.reply('Invalid argument.'); // !stop foo bar

		if (args[0] == 'confirm' && args[1] == 'emergency') { // !stop confirm emergency
			await message.reply('Now logging out without saving. Goodbye!');
			globals.client.destroy();

		}
	},
};