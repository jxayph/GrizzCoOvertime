const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
module.exports = {
	name: 'resetroles',
	description: 'Reset tournament roles.',
	detailed: 'Removes the registered and active participant roles from all users in the server. Only use this after a tournament concludes.',
	admin: true,
	async execute(message, args, globals) {

		let deletionList = ['Registered', 'Active Participant'];

		for (let i = 0; i < globals.teamCount; i++) {
			deletionList.push(`Squad ${i + 1}`);
		}


		for (let i = 0; i < deletionList.length; i++) {
			await eraseRole(message, deletionList[i])
				.then(message.channel.send(`Erasure of \'${deletionList[i]}\' complete.`));
		}
	},
};
