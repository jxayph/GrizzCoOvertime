const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
module.exports = {
	name: 'test',
	description: 'whatever',
	detailed: 'admin test shit',
	admin: true,
	async execute(message, args, globals) {
		const userData = globals.client.userData;

		console.log(globals.client.channels.cache.find(channel => channel.id === '1098739930190065705'));

		for (const channel in globals.client.channels.cache.entries) {
			// console.log(channel.id);
		}
		// for (const user in userData) {
		// 	userData[user].average = Math.floor(userData[user].average);

		// 	saveUserData(globals.fs, globals.client);
		// 	console.log(userData[user].average);
		// }
	},
};
