const BOT_ID = '518861328526606347';
const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
const checkValue = require('../../helpers/checkValue.js').checkValue;

module.exports = {
	name: 'coinflip',
	description: 'Gamble on a coin toss.',
	detailed: 'Flip a coin to potentially double your money, but be wary of snatchers...',
	admin: false,
	execute(message, args, globals) {

		const member = message.guild.members.cache.get(message.author.id);
		if (member.roles.cache.some(role => role.name === 'gambling rehab')) {
			return message.reply('It\'s time to stop. Please, seek help. Your family is concerned. \nhttps://www.addictioncenter.com/drugs/gambling-addiction/');
		}

		const user = globals.client.userData[message.author.id]; // Pull userData
		if (!user) return message.reply('You are not registered.');

		let wager = parseInt(args[0]);
		if (args[0] == 'all') wager = user.balance;

		if (!checkValue(wager, user)) return message.reply('Please wager a valid number.');

		let result = '';

		if (Math.floor(Math.random() * 20) == 0) {
			result = 'A snatcher grabbed the coin out of the air! You lose.';
			user.balance -= wager;
			globals.client.userData[BOT_ID].balance += wager;
		}
		else if (Math.floor(Math.random() * 100) == 0) {
			result = 'The coin hit a snatcher, knocking it out of the sky! You win BIG.';
			user.balance += (wager * 50);
			globals.client.userData[BOT_ID].balance -= (wager * 50);
		}
		else if (Math.floor(Math.random() * 2) == 0) {
			result = 'Heads! You win.';
			user.balance += wager;
			globals.client.userData[BOT_ID].balance -= wager;
		}
		else {
			result = 'Tails! You lose.';
			user.balance -= wager;
			globals.client.userData[BOT_ID].balance += wager;
		}
		if (globals.client.userData[BOT_ID].balance < 0) globals.client.userData[BOT_ID].balance = 0;

		saveUserData(globals.fs, globals.client);
		return message.channel.send(result);
	},
};