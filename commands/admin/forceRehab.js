const REHAB_ROLE = 'gambling rehab';
const saveRehabData = require('../../helpers/saveRehabData.js').saveRehabData;
module.exports = {
	name: 'forcerehab',
	description: 'Forcefully admit a player to rehab, indefinitely.',
	detailed: 'To toggle rehab status, simply call !forcerehab <mention> again.\n',
	admin: true,
	execute(message, args, globals) {

		const rehab = require('../../rehab.json');
		const userID = message.mentions.users.first().id;
		const member = message.guild.members.cache.get(userID);

		if (!member.roles.cache.some(role => role.name === REHAB_ROLE)) { // If they don't have the role
			message.guild.members.cache.get(userID).roles.add(message.guild.roles.cache.find(role => role.name === REHAB_ROLE));
			message.channel.send('You have been placed in gambling rehab for an indefinite period of time. Please reflect on how your gambling habits are influencing your life.');
			rehab[userID] = -1; // Set their checkout time to indefinite
		}

		saveRehabData(globals.fs, rehab);
		return;
	},
};

