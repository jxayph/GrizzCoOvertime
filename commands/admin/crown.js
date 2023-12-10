const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
const CHAMP_ROLE = 'CHAMPION';
const HOF_ROLE = 'Hall of Fame';

module.exports = {
	name: 'crown',
	description: 'Crown the winner of a tournament.',
	detailed: '!crown <mention>',
	admin: true,
	async execute(message, args, globals) {

		if (!message.mentions.users.first()) {
			return message.reply('Please mention a valid player.');
		}
		const userID = message.mentions.users.first().id;
		const userData = globals.client.userData[userID];
		if (userData) {
			message.channel.send(`Congratulations to ${userData.IGN} on claiming the champion's throne for this GCOT!`);
			eraseRole(message, CHAMP_ROLE);
			userData.wins++;

			const member = message.guild.members.cache.get(userID);
			member.roles.add(message.guild.roles.cache.find(role => role.name === CHAMP_ROLE));
			member.roles.add(message.guild.roles.cache.find(role => role.name === HOF_ROLE));

			saveUserData(globals.fs, globals.client);

		}
		else {
			message.reply('Please mention a valid player.');
		}

		return;
	},
};