const BOT_ID = '518861328526606347';
const checkValue = require('../../helpers/checkValue.js').checkValue;
const saveLottoData = require('../../helpers/saveLottoData.js').saveLottoData;
const saveUserData = require('../../helpers/saveUserData.js').saveUserData;

module.exports = {
	name: 'lotto',
	description: 'Play in the lottery.',
	detailed: '!lotto <wager>. Eggbot will match your wager, but gets better odds.',
	admin: false,
	async execute(message, args, globals) {

		const member = message.guild.members.cache.get(message.author.id);
		if (member.roles.cache.some(role => role.name === 'gambling rehab')) {
			return message.reply('It\'s time to stop. Please, seek help. Your family is concerned. \nhttps://www.addictioncenter.com/drugs/gambling-addiction/');
		}
		const wager = parseInt(args[0]);
		const user = globals.client.userData[message.author.id];
		if (!user) return message.reply('You are not registered.');

		if (checkValue(wager, user) && wager != 0) {
			globals.client.lotto.buy(message.author.id.toString(), wager);
			user.balance -= wager;
			globals.client.userData[BOT_ID].balance += wager;

			saveLottoData(globals.fs, globals.client);
			saveUserData(globals.fs, globals.client);
		}
		else {
			return message.reply('Please enter a valid number.');
		}
		if (wager == 1) return message.reply(`You bought ${wager} entry in the lottery. Good luck!`);
		return message.reply(`You bought ${wager} entries in the lottery. Good luck!`);
	},
};
