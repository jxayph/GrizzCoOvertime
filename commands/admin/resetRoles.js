const eraseRole = require('../../helpers/eraseRole.js').eraseRole;
module.exports = {
	name: 'resetroles',
	description: 'Reset tournament roles.',
	detailed: 'Removes the registered and active participant roles from all users in the server. Only use this after a tournament concludes.',
	admin: true,
	async execute(message, args, globals) {
		const teams = args[0];

		const deletionList = ['Registered', 'Active Participant', 'Substitute'];
		// const deletionList = ['Active Participant'];
		for (let i = 0; i < teams; i++) {
			deletionList.push(`Squad ${i + 1}`);
		}

		for (let i = 0; i < deletionList.length; i++) {
			await eraseRole(message, deletionList[i])
				.then(() => message.channel.send(`Erasure of '${deletionList[i]}' complete.`));
		}
		return true;
	},
};
