const REHAB_ROLE = 'gambling rehab';
const saveRehabData = require('../../helpers/saveRehabData.js').saveRehabData;

module.exports = {
	name: 'rehab',
	description: 'Check in or out of gambling rehab.',
	detailed: 'Checking into rehab is free, but you must stay for at least 24 hours.',
	admin: false,
	async execute(message, args, globals) {

		const rehab = require('../../rehab.json');

		const ID = message.author.id;

		const rehabDate = new Date (rehab[ID]);
		const user = globals.client.userData[ID];
		const member = message.guild.members.cache.get(ID);

		if (user) { // If they're a registered gambler

			if (!member.roles.cache.some(role => role.name === REHAB_ROLE)) { // If they don't have the role
				message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(role => role.name === REHAB_ROLE));
				message.reply('Welcome to gambling rehab. We hope that you find the help you need during your stay with us.');
				rehab[ID] = new Date(new Date().getTime() + 86400000); // Set their checkout time
			}
			else if (!rehab[ID] || rehab[ID] == -1) {
				return message.reply('Your stay is indefinite. You may not check out of rehab until an admin allows it.');
			}
			else if (rehabDate < new Date()) { // If the current date is after their minimum checkout...
				message.guild.members.cache.get(message.author.id).roles.remove(message.guild.roles.cache.find(role => role.name === REHAB_ROLE));
				message.reply('Congratulations on leaving gambling rehab. We hope that you have learned to gamble responsibly during your stay with us.');
			}
			else { // Not enough time has passed
				message.reply(`You may not check out of rehab until <t:${Math.round(rehabDate.getTime() / 1000).toString()}>.`);
			}

			saveRehabData(globals.fs, rehab);
			return;
		}
	},
};

