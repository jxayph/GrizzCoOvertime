module.exports = {
	name: 'checklotto',
	description: 'Look at the current lotto.',
	detailed: '!checklotto',
	admin: false,
	async execute(message, args, globals) {
		const lotto = globals.client.lotto;
		const wager = lotto.getWager(message.author.id);
		if (wager <= 0) return message.reply('You are not participating in the lotto.');
		else if (wager == 1) return message.reply(`You have ${wager} entry in the total pot of ${globals.client.lotto.pot} golden egg coins.`);
		return message.reply(`You have ${wager} entries in the total pot of ${globals.client.lotto.pot} golden egg coins.`);
	},
};
