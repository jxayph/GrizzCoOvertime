const PRICE = 1000;

module.exports = {
	name: 'unpaog',
	description: 'Remove your paoggers champion role.',
	detailed: 'Remove the paogchamp role if you don\'t want to be pinged.',
	admin: false,
	async execute(message, args, globals) {

		const user = globals.client.userData[message.author.id];
		const member = message.guild.members.cache.get(message.author.id);
		if (args[0] == `${PRICE}`) {
			if (user) {
				if (user.balance > PRICE) {
					if (member.roles.cache.some(role => role.name === 'paogchamp')) {

						user.balance -= PRICE;
						message.guild.members.cache.get(message.author.id).roles.remove(message.guild.roles.cache.find(role => role.name === 'paogchamp'));
						message.reply('I guess you\'re not my little paogchamp after all...');
					}
					else {
						message.reply('You\'re not a paogchamp.');
					}

				}
				else {
					message.reply('You don\'t have enough golden eggs for the procedure.');
				}
			}
			else {
				message.reply('You are not registered.');
			}
		}
		else {
			message.reply(`Would you like to remove the paogchamp role? Type !unpaog ${PRICE} to pay ${PRICE} golden eggs to remove it.`);
		}

	},
};
